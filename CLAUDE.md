# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Local development (SQLite file via Prisma)
npm run dev          # Start Next.js dev server on port 3000

# Quality checks
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run type-check   # TypeScript type checking
npm run build:check  # Full check: type-check + lint + next build

# Cloudflare deployment
npm run cf:build     # Build for Cloudflare Workers (OpenNext)
npm run cf:preview   # Build + run locally via Wrangler (tests actual Worker)
npm run cf:deploy    # Build + deploy to Cloudflare Workers

# Database
npx prisma generate           # Regenerate Prisma client after schema changes
npx prisma db push            # Push schema to local SQLite dev.db (no migration)
npm run d1:migrate:local      # Apply SQL migrations to local Wrangler D1
npm run d1:migrate:remote     # Apply SQL migrations to production D1
npm run create-admin          # Create admin user (runs against local dev.db)
```

Husky hooks run `type-check` + `lint:fix` on commit and `build:check` on push.

## Architecture

**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Prisma (SQLite/D1), NextAuth.js (JWT, credentials-only), Resend (email), Cloudflare R2 (media), Cloudflare Workers (hosting).

**Deployment:** GitHub push to `main` → GitHub Actions → Wrangler deploys to Cloudflare Workers. CI applies D1 migrations before deploying. No Docker or VPS.

### Directory structure

- `src/app/` — App Router pages and API routes
- `src/components/cuisine/` — All public-facing page sections (hero, about, gallery, kimchi, contact, nav, footer)
- `src/components/admin/` — Admin UI shell and form components
- `src/components/admin/visual/` — Inline edit overlay system (see below)
- `src/components/editor/` — TipTap rich text editor used in admin forms
- `src/lib/` — Auth config, Prisma client, R2 storage, rate-limiter stub, siteContent helpers

### Content management pattern

Site text is stored in two layers that merge at render time:

1. **Hardcoded defaults** in `src/components/cuisine/translations.ts` — the canonical fallback values.
2. **Database overrides** in the `SiteContent` table — key-value pairs using dot-notation keys (e.g., `hero.title1`, `kimchi.hero.desc`).

`src/lib/siteContent.ts` exports `getContentMap()` (fetches DB rows) and `mergeContent()` (merges DB values over defaults). Public pages call `getContentMap()` server-side and pass the merged object as `t` props.

### Visual (inline) content editor

`/admin/content` renders the actual public page sections inside the admin, wrapped in `EditProvider` from `src/components/admin/visual/EditContext.tsx`. When the admin toggles edit mode, `EditableText`, `EditableImage`, and `EditableTitleBlock` components switch from read-only display to click-to-edit overlays. Each save calls `PUT /api/admin/content` which upserts the key in `SiteContent`.

### Database (Cloudflare D1 / SQLite)

Production database is Cloudflare D1 (SQLite). `src/lib/prisma.ts` exports a `prisma` Proxy that lazily constructs a `PrismaClient` with `@prisma/adapter-d1` when the first property is accessed (must be within a request context on Workers). Falls back to a plain `PrismaClient` for local `npm run dev` (reads `DATABASE_URL=file:./prisma/dev.db`).

SQLite migrations live in `prisma/migrations/`. To add a migration: write the SQL in a new directory, then run `npm run d1:migrate:local` / `npm run d1:migrate:remote`.

### Media / image uploads

Files are uploaded to Cloudflare R2 (S3-compatible) via `src/lib/r2-storage.ts`. R2 must be configured — there is no local filesystem fallback. Media metadata is tracked in the `MediaItem` (table: `media_library`) DB table. Image upload API: `POST /api/media`.

### Admin auth

NextAuth with credentials provider (`src/lib/auth.ts`). Sessions are JWT. Admin API routes are individually protected by importing `withAuth`/`checkAuth` from `src/lib/auth-middleware.ts`. Admin pages are gated in `src/app/admin/layout.tsx` via `getServerSession`. There is no edge middleware file.

### Public routes

| Route | Description |
|---|---|
| `/` | Home — hero, about, specialties, gallery, mentoring, order sections |
| `/kimchi` | Dedicated kimchi product page |
| `/contact` | Contact form (sends via Resend) |
| `/shop` | Product/cake shop listing |
| `/blog` | News posts listing |
| `/blog/[slug]` | Individual post |
| `/credentials` | CV / achievements page |

### Environment variables

Copy `.env.example` to `.env.local` for local dev:

```
DATABASE_URL          # SQLite: file:./prisma/dev.db
NEXTAUTH_SECRET       # JWT signing secret
NEXTAUTH_URL          # http://localhost:3000 locally
RESEND_API_KEY        # Email sending
CONTACT_TO_EMAIL      # Contact form destination
R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET_NAME / R2_PUBLIC_URL
```

Production secrets are set with `wrangler secret put <NAME>` (never committed). Non-secret production vars (like `NEXTAUTH_URL`) live in `wrangler.toml [vars]`.

### One-time Cloudflare setup

1. `wrangler login`
2. `wrangler d1 create valentin-cuisine-db` → paste `database_id` into `wrangler.toml`
3. `npm run d1:migrate:remote` — apply baseline migration to production D1
4. Create admin user: generate a bcrypt hash locally (`npm run create-admin` against dev.db), then insert into production D1 via `wrangler d1 execute valentin-cuisine-db --remote --command="INSERT INTO users ..."`
5. Set secrets: `wrangler secret put NEXTAUTH_SECRET` (and R2, Resend vars)
6. GitHub repo secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
7. Push to `main` — CI deploys automatically

### Wrangler config

`wrangler.toml` defines the Worker entry point, D1 binding (`DB`), and static assets. `open-next.config.ts` configures the OpenNext Cloudflare adapter. `worker-configuration.d.ts` provides TypeScript types for `CloudflareEnv`.
