# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run type-check   # TypeScript type checking
npm run build:check  # Full pre-deploy check: type-check + lint + build
npm run db:seed      # Seed the database
npm run create-admin # Create an admin user (tsx src/lib/create-admin.ts)
```

Husky hooks run `type-check` + `lint:fix` on commit and `build:check` on push. Always run `npm run build:check` before committing to catch issues early.

`dev.sh` starts the dev server and opens an SSH reverse tunnel to the staging server at port 8080.

## Architecture

**Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Prisma + PostgreSQL, NextAuth.js (JWT, credentials-only), Resend (email), Cloudflare R2 (media storage).

### Directory structure

- `src/app/` — App Router pages and API routes
- `src/components/cuisine/` — All public-facing page sections (hero, about, gallery, kimchi, contact, nav, footer)
- `src/components/admin/` — Admin UI shell and form components
- `src/components/admin/visual/` — Inline edit overlay system (see below)
- `src/components/editor/` — TipTap rich text editor used in admin forms
- `src/lib/` — Auth config, Prisma client, R2 storage, image utils, rate limiter, siteContent helpers

### Content management pattern

Site text is stored in two layers that merge at render time:

1. **Hardcoded defaults** in `src/components/cuisine/translations.ts` — the canonical fallback values.
2. **Database overrides** in the `SiteContent` table — key-value pairs using dot-notation keys (e.g., `hero.title1`, `kimchi.hero.desc`).

`src/lib/siteContent.ts` exports `getContentMap()` (fetches DB rows) and `mergeContent()` (merges DB values over defaults). Public pages call `getContentMap()` server-side and pass the merged object as `t` props.

### Visual (inline) content editor

`/admin/content` renders the actual public page sections inside the admin, wrapped in `EditProvider` from `src/components/admin/visual/EditContext.tsx`. When the admin toggles edit mode, `EditableText`, `EditableImage`, and `EditableTitleBlock` components switch from read-only display to click-to-edit overlays. Each save calls `PUT /api/admin/content` which upserts the key in `SiteContent`.

### Media / image uploads

Files are uploaded to Cloudflare R2 via `src/lib/r2-storage.ts` (S3-compatible). If R2 is not configured, uploads fall back to local filesystem at `UPLOAD_PATH`. Media metadata is tracked in the `MediaItem` DB table. The API route is `src/app/api/media/route.ts`.

Image uploads from TipTap use `src/components/editor/ImageUploadWidget.tsx`. `src/lib/image-processor.ts` handles resizing with `sharp`.

### Admin auth

NextAuth with credentials provider (`src/lib/auth.ts`). Sessions are JWT. The middleware at `src/lib/auth-middleware.ts` protects `/admin/*` routes. Admin users are created with `npm run create-admin` (password hashed with bcryptjs).

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
DATABASE_URL          # PostgreSQL connection string
NEXTAUTH_SECRET       # JWT signing secret
NEXTAUTH_URL          # Full URL (e.g. http://localhost:3000 locally)
RESEND_API_KEY        # Email sending
CONTACT_TO_EMAIL      # Destination for contact form submissions
R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET_NAME / R2_PUBLIC_URL
```

### Deployment

Docker Compose (`docker-compose.yml`) runs the app on port 3026 (mapped internally to 3000) alongside PostgreSQL 14. The `Dockerfile` targets `linux-musl-openssl-3.0.x` for the Prisma binary. Staging uses `docker-compose.staging.yml`.
