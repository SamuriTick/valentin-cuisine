# Valentin's Cuisine — Website

A portfolio and business website for Valentin's Cuisine, a young baker and pastry chef based in Putney, London. The site showcases baked goods and pastries, features a Korean kimchi product line, accepts custom cake orders, and includes a full admin CMS for managing content without touching code.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Setup Checklist](#setup-checklist)
- [Step 1 — Domain Name](#step-1--domain-name)
- [Step 2 — VPS](#step-2--vps)
- [Step 3 — GitHub Repository](#step-3--github-repository)
- [Step 4 — Cloudflare R2 (Media Storage)](#step-4--cloudflare-r2-media-storage)
- [Step 5 — Resend (Email)](#step-5--resend-email)
- [Step 6 — Environment Variables](#step-6--environment-variables)
- [Step 7 — VPS Wiring (GitHub Secrets + Nginx)](#step-7--vps-wiring-github-secrets--nginx)
- [Step 8 — First Deploy](#step-8--first-deploy)
- [Step 9 — Create Admin User](#step-9--create-admin-user)
- [Local Development](#local-development)
- [Database](#database)
- [Admin CMS](#admin-cms)
- [Project Structure](#project-structure)
- [Useful Commands](#useful-commands)
- [Troubleshooting](#troubleshooting)
- [Technical Reference](#technical-reference)

---

## Design Decisions

A few choices in this project that are intentional:

**Contact form, not a phone number or public email.** Listing a phone number or email address on a public website invites spam bots and time-wasters. A contact form filters intent — someone who fills in a form is more likely to be a real, motivated customer. Form submissions are emailed privately to Valentin via Resend.

**No email marketing or newsletter blasts.** The waiting list collects signups but we don't send bulk campaigns. For a small local business, relationships are built individually, not through mass emails that end up in spam folders. The waiting list is there to notify people when something new launches — not to flood inboxes.

**VPS over Vercel.** Vercel is convenient but charges by usage. A VPS costs a flat $6/month regardless of traffic. For a site that may get featured or shared unexpectedly, predictable costs matter. The setup is no harder than Vercel when Claude is helping.

**Cloudflare for everything public-facing.** Domain registration, DNS, and DDoS protection all in one dashboard with no extra cost. Fewer accounts, fewer places things can go wrong.

**Media in R2, not on the server.** The VPS is ephemeral — it can be rebuilt, migrated, or scaled. Files stored on it can disappear. R2 is permanent object storage with its own redundancy. Photos never live on the server.

---

## Features

- **Portfolio** — Hero section, photo gallery, and customer testimonials
- **Shop** — Product listings for cakes, pastries, and kimchi
- **Kimchi Page** — Dedicated page for the kimchi product line with FAQs
- **Contact Form** — Filters enquiries; no phone number or public email exposed
- **Waiting List** — Collects signups for new launches (no bulk email campaigns)
- **Admin CMS** — Full content management: products, posts, pages, media, site text
- **Media Library** — Drag-and-drop uploads to Cloudflare R2 with image cropping
- **SEO** — Sitemap, structured data (schema.org), per-page metadata, canonical URLs

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 3 |
| Database | PostgreSQL 14 |
| ORM | Prisma 6 |
| Auth | NextAuth 4 (credentials + JWT) |
| File Storage | Cloudflare R2 (S3-compatible) |
| Email | Resend |
| Rich Text | TipTap |
| Containerisation | Docker + Docker Compose |
| CI/CD | GitHub Actions |

---

## Architecture Overview

Understanding why the stack is split this way will help you set it up correctly.

```
User's browser
      │
      ▼
Cloudflare DNS  ──►  Your VPS  (Nginx reverse proxy)
                          │
                          ▼
                    Docker containers
                    ┌─────────────────┐
                    │  Next.js app    │  port 3026
                    │  (wacc-website) │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  PostgreSQL 14  │  (database container)
                    └─────────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
       Cloudflare R2     Resend         GitHub Actions
       (media files)     (emails)       (CI/CD deploys)
```

**Why not store media on the VPS?**
Think of the VPS like a computer you're renting. It has a fixed hard drive — typically 25 GB. If you stored every uploaded photo on it, you'd fill it up, and if the server ever gets wiped or rebuilt you'd lose everything. Cloudflare R2 is cloud object storage: it's like a limitless hard drive that lives separately from your server, is backed up automatically, and never loses files. The first 10 GB per month is free. All uploaded photos go to R2; the VPS only runs the application code and database.

**Why not store the database on R2?**
R2 is object (file) storage, not a relational database. PostgreSQL needs to run somewhere that supports read/write queries. It runs in a Docker container on the VPS alongside the app, with its data persisted to a named Docker volume so it survives container restarts and redeploys.

---

## Setup Checklist

Work through these in order. Each step feeds credentials into the next.

- [ ] Buy a domain name
- [ ] Provision a VPS and note its IP address
- [ ] Point domain DNS → VPS IP
- [ ] Fork/push the repo to GitHub
- [ ] Create a Cloudflare account and R2 bucket
- [ ] Create a Resend account, verify domain, generate API key
- [ ] Write the `.env` file on the VPS
- [ ] Add GitHub Actions secrets
- [ ] Install Nginx + SSL on the VPS
- [ ] Trigger first deploy from GitHub
- [ ] SSH into VPS and create the admin user

---

## Step 1 — Domain Name

Buy and manage your domain through **Cloudflare Registrar** ([cloudflare.com/products/registrar](https://cloudflare.com/products/registrar)). Cloudflare sells domains at cost (no markup), includes free DNS, DDoS protection, and their proxy can handle SSL — all in one place.

1. Sign in to Cloudflare → **Domain Registration** → **Register Domains**
2. Search for your domain and purchase it
3. DNS is managed automatically within Cloudflare — no nameserver changes needed
4. After your VPS is provisioned (Step 2), come back and add an **A record**:
   - Go to your domain → **DNS** → **Records** → **Add record**
   - **Type:** A
   - **Name:** `@`
   - **IPv4 address:** your VPS IP
   - **Proxy status:** Proxied (orange cloud) — enables DDoS protection and free SSL
5. Add a second A record with **Name:** `www` pointing to the same IP

---

## Step 2 — VPS

A VPS (Virtual Private Server) is a Linux server you rent by the hour. You get full control over it — you install Docker, the app runs inside containers, and no one else shares your resources. Use **DigitalOcean** ([digitalocean.com](https://digitalocean.com)).

> **Why not Vercel?** Vercel is a popular hosting platform for Next.js but it charges based on how many visitors you get. For a small site that grows, costs can spike unexpectedly. A VPS costs a flat ~$6/month no matter how much traffic you receive, and the setup with this repo is the same amount of effort as Vercel — especially with Claude helping.

### Create a Droplet

1. Create an account on DigitalOcean
2. Click **Create** → **Droplets**
3. Choose **Ubuntu 22.04 LTS**
4. Plan: **Basic** → **Regular** → **$6/mo** (1 vCPU, 1 GB RAM, 25 GB SSD)
5. Datacenter region: **London** (LON1) — closest to the audience
6. Under **Authentication**, choose **SSH Key** (see below)
7. Click **Create Droplet** and note the IP address it assigns

### SSH keys — what they are and why you need them

An SSH key is a pair of files: a **private key** (stays on your computer, never shared) and a **public key** (you put this on any server you want to access). When you connect to the server, it checks that your private key matches the public key on file — no password needed.

You need SSH keys for two things:
- Logging into the server yourself from your terminal
- Letting GitHub Actions deploy automatically (it uses its own key pair)

#### Create your personal SSH key (if you don't have one)

```bash
# On your local machine — check if you already have a key
ls ~/.ssh/id_ed25519.pub

# If not, create one
ssh-keygen -t ed25519 -C "your@email.com"
# Press Enter to accept the default path, set a passphrase if you like

# Print your public key — you'll paste this into DigitalOcean
cat ~/.ssh/id_ed25519.pub
```

Copy that output and paste it into DigitalOcean under **Authentication → SSH Keys → New SSH Key** when creating the Droplet. Now you can log in with:

```bash
ssh root@YOUR_VPS_IP
```

### Initial server setup

Once you're in, run these commands to install Docker and prepare the server:

```bash
apt update && apt upgrade -y
curl -fsSL https://get.docker.com | sh

# Create the directory where Docker images and deploy files will be stored
mkdir -p /root/docker-images/valentincuisine
```

The full server hardening steps (creating a non-root user, setting permissions, etc.) are in the [Technical Reference](#technical-reference) section at the bottom of this file.

---

## Step 3 — GitHub Repository

The site deploys automatically every time you push code to GitHub. You need to put this project in your own GitHub repository first.

If you received the project as a zip file:
1. Unzip it on your computer
2. Create a free account at [github.com](https://github.com) if you don't have one
3. Create a new **private** repository (click the **+** → **New repository**)
4. Open a terminal inside the unzipped project folder and ask Claude to push it to your new repo — give Claude your repository URL and it will run the git commands for you

Keep the GitHub tab open — you'll be adding secrets to it in Step 7.

---

## Step 4 — Cloudflare R2 (Media Storage)

All uploaded photos and media are stored in R2, not on the VPS disk.

### Create a bucket

1. Sign up or log in at [cloudflare.com](https://cloudflare.com)
2. In the sidebar, go to **R2 Object Storage**
3. Click **Create bucket**
   - Name: `valentin-cuisine-media` (or anything you like — note it down)
   - Location: Automatic
4. Once created, open the bucket and go to **Settings → Public Access**
5. Click **Allow Access** to make uploads publicly readable

### Get your API credentials

1. In the R2 section, click **Manage R2 API Tokens**
2. Click **Create API Token**
   - Token name: `valentin-cuisine-deploy`
   - Permissions: **Object Read & Write**
   - Specify bucket: select your bucket
3. Click **Create API Token**
4. **Copy and save both keys immediately** — the Secret Access Key is only shown once:
   - Access Key ID
   - Secret Access Key
5. Also note your **Account ID** — it's in the R2 dashboard sidebar (right side)

### Get your public bucket URL

On the bucket's Settings page, you'll see a URL like:
```
https://pub-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.r2.dev
```
This is your `R2_PUBLIC_URL`. Copy it.

> See `R2_SETUP.md` for additional configuration options including custom domains.

---

## Step 5 — Resend (Email)

Resend sends contact form notifications and any transactional emails.

### Create an account and verify your domain

1. Sign up at [resend.com](https://resend.com) — free tier is 3,000 emails/month
2. Go to **Domains** → **Add Domain**
3. Enter your domain (e.g. `valentincuisine.com`)
4. Resend will give you DNS records to add — go to your domain in **Cloudflare → DNS → Records** and add each one:
   - Usually 1 MX record
   - 2–3 TXT records for DKIM and SPF
5. Come back to Resend and click **Verify** — it may take a few minutes

### Generate an API key

1. Go to **API Keys** → **Add API Key**
2. Name it (e.g. `valentin-cuisine-production`)
3. Permission: **Sending access**
4. Domain: select your verified domain
5. Copy the key — it starts with `re_`

---

## Step 6 — Environment Variables

An `.env` file is a plain text file that holds secret configuration values — API keys, passwords, database addresses — that the app reads at startup. These values are never committed to GitHub (they're in `.gitignore`) so each environment has its own copy.

You need one in two places:

- **On your computer** (for local development): `.env.local` in the project root — copy from `.env.example` and fill in your values
- **On the VPS** (for production): `/root/docker-images/valentincuisine/.env.valentin-cuisine.local` — create this file on the server with your production values

By the time you reach this step you should have collected:
- A strong random string for `NEXTAUTH_SECRET` (ask Claude to generate one)
- Your domain URL for `NEXTAUTH_URL`
- Your Resend API key
- The email address that should receive contact form submissions
- Your five Cloudflare R2 values (Account ID, Access Key ID, Secret Access Key, bucket name, public URL)

The full variable reference with exact names and example values is in the [Technical Reference](#technical-reference) section.

---

## Step 7 — VPS Wiring (GitHub Secrets + Nginx + SSL)

### Connect GitHub to your VPS

GitHub Actions needs permission to log into your VPS to deploy. You do this by creating a dedicated SSH key pair — a private key that GitHub holds secretly, and a public key you put on the VPS.

Ask Claude to do this for you. Tell Claude:
- Your VPS IP address
- That you want to generate a GitHub Actions deploy key and add it to the VPS

Claude will generate the key pair, show you the public key to add to the VPS, and give you the private key to paste into GitHub.

Once the key is in place, add three secrets to your GitHub repo under **Settings → Secrets and variables → Actions**:

| Secret name | Value |
|---|---|
| `VPS_PROD_HOST` | Your VPS IP address |
| `VPS_PROD_USER` | `root` |
| `VPS_PROD_SSH_KEY` | The private deploy key (Claude will provide this) |

### Set up Nginx and SSL

Nginx is a web server that sits in front of the app. It receives traffic on ports 80 (HTTP) and 443 (HTTPS) and forwards it to the app running on port 3026. It also handles SSL so your site is served over `https://`.

Ask Claude to set up Nginx and install an SSL certificate using **Certbot** on your VPS. Certbot gets a free certificate from Let's Encrypt and sets up automatic renewal — you never have to touch it again.

Tell Claude:
- Your VPS IP address
- Your domain name

The exact Nginx config and Certbot commands are in the [Technical Reference](#technical-reference) section for Claude to use.

---

## Step 8 — Two Environments: Staging and Production

This project uses two separate environments. **Always make changes on staging first, verify they work, then push to main.** Never push untested changes straight to production.

| Environment | Branch | URL | Purpose |
|---|---|---|---|
| Staging | `staging` | e.g. `staging.valentincuisine.com` | Test changes safely |
| Production | `main` | `valentincuisine.com` | Live site — real visitors |

You need two separate Droplets on DigitalOcean (one per environment), each with its own domain/subdomain, its own `.env` file, and its own set of GitHub secrets.

| GitHub Secret | Staging | Production |
|---|---|---|
| Host | `VPS_STAGING_HOST` | `VPS_PROD_HOST` |
| User | `VPS_STAGING_USER` | `VPS_PROD_USER` |
| SSH Key | `VPS_STAGING_SSH_KEY` | `VPS_PROD_SSH_KEY` |

### How deploys work (GitHub Actions)

GitHub Actions is GitHub's built-in automation system. It runs on GitHub's own servers, so you don't pay for compute — **free private repositories get 2,000 minutes of compute per month**, which is far more than a small site will ever use for deployments.

The repo already has GitHub Actions workflows wired up. You don't configure anything — just push to the right branch and GitHub does the rest automatically:

```
Push to staging branch  →  GitHub Actions  →  staging server deploys
Push to main branch     →  GitHub Actions  →  production server deploys
```

What happens behind the scenes on each deploy:
1. GitHub builds a Docker image of the latest code
2. Transfers it to the VPS
3. Stops the old containers, runs database migrations, starts the new containers
4. Cleans up old images to free disk space

The first deploy takes a few minutes longer because Docker pulls its base images from scratch.

### Day-to-day workflow

1. Make your changes locally
2. Push to the `staging` branch — staging site updates automatically
3. Check staging, make sure everything looks right
4. Merge or push to `main` — production updates automatically

### Manual deploy (without pushing new code)

GitHub → **Actions** → **Deploy to Production** → **Run workflow** → **Run workflow**

---

## Step 9 — Create Admin User

After the first successful deploy, you need to create the admin login for the CMS. Ask Claude to do this — tell Claude your VPS IP address and it will SSH in and run the create-admin command inside the app container for you. You'll be asked to choose an email and password, which becomes your login for `/admin`.

---

## Local Development

### Requirements

- Node.js 20+
- Yarn
- Docker Desktop (for the local PostgreSQL database)

### Steps

```bash
# Clone the repo
git clone <repo-url>
cd nextjs-valentin-cuisine

# Install dependencies
yarn install

# Copy the example env file and fill in your values
cp .env.example .env.local

# Start the local database container
docker-compose up -d db

# Run database migrations
yarn prisma migrate dev

# (Optional) Seed with sample content
yarn db:seed

# Create your local admin user
yarn create-admin

# Start the dev server
yarn dev
```

The site runs at `http://localhost:3000`
The admin runs at `http://localhost:3000/admin`

---

## Database

The app uses PostgreSQL 14 with Prisma as the ORM.

```bash
# Apply pending migrations (production / CI)
yarn prisma migrate deploy

# Create a new migration after editing schema.prisma (development only)
yarn prisma migrate dev --name describe-your-change

# Open Prisma Studio — visual browser for the database
yarn prisma studio
```

### Data models

| Model | Purpose |
|---|---|
| `User` | Admin users |
| `Post` | Posts (retired — kept in schema, not exposed on site) |
| `Product` | Cakes, pastries, kimchi listings |
| `Page` | Custom CMS pages |
| `Reference` | Customer testimonials |
| `SiteContent` | Key/value store for editable site copy |
| `MediaItem` | Metadata for uploaded media files |
| `WaitingListSignup` | Newsletter subscribers |

Database data is stored in a Docker named volume (`db_data`) and survives container restarts and redeploys.

---

## Admin CMS

The admin panel is at `/admin`, protected by email/password login.

| Section | Path | What you can do |
|---|---|---|
| Dashboard | `/admin` | Overview and quick links |
| Products | `/admin/products` | Add/edit cakes, pastries, kimchi |
| Posts | `/admin/posts` | Retired — not linked from the public site |
| Pages | `/admin/pages` | Create custom pages |
| Media | `/admin/media` | Upload, crop, and tag photos |
| References | `/admin/references` | Add customer testimonials |
| Site Content | `/admin/site-content` | Edit hero text, section copy, labels |
| Waiting List | `/admin/waiting-list` | View newsletter signups |
| Settings | `/admin/settings` | Change admin password and email |

---

## Project Structure

```
.
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Migration history (committed to git)
│   └── seed.ts                # Sample data seed script
├── src/
│   ├── app/
│   │   ├── admin/             # Admin CMS pages
│   │   ├── api/               # REST API routes (22 endpoints)
│   │   ├── blog/              # Retired — pages exist in codebase but not linked
│   │   ├── shop/              # Product listing
│   │   ├── kimchi/            # Kimchi product page
│   │   ├── contact/           # Contact page
│   │   └── credentials/       # Testimonials page
│   ├── components/
│   │   ├── admin/             # Admin UI components
│   │   ├── cuisine/           # Site-specific components
│   │   └── editor/            # Rich text editor
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── r2-storage.ts      # Cloudflare R2 integration
│   │   └── siteContent.ts     # Dynamic site content helpers
│   └── types/                 # Shared TypeScript types
├── .github/workflows/
│   ├── main.yml               # Production deployment workflow
│   └── deploy-staging.yml     # Staging deployment workflow
├── docker-compose.yml          # App + database containers
├── Dockerfile                  # Multi-stage production build
├── deploy-valentin-cuisine.sh  # VPS deployment script (run by CI)
└── .env.example                # Environment variable template
```

---

## Useful Commands

```bash
yarn dev                        # Start dev server (localhost:3000)
yarn build                      # Production build
yarn lint                       # Run ESLint
yarn lint:fix                   # Auto-fix lint issues
yarn type-check                 # TypeScript check only
yarn build:check                # Full pre-deploy check (type + lint + build)
yarn db:seed                    # Seed the database with sample data
yarn create-admin               # Create an admin user
yarn prisma studio              # Open visual database browser
yarn prisma migrate dev         # Create a new migration (dev only)
yarn prisma migrate deploy      # Apply migrations (production)
```

---

## Troubleshooting

### Site shows "502 Bad Gateway"

The app container isn't running or isn't ready yet.

```bash
ssh deploy@YOUR_VPS_IP
docker ps                              # Check if containers are running
docker logs valentin-cuisine-app       # Check app logs for errors
```

### Contact form isn't sending emails

1. Check that `RESEND_API_KEY` is correct in the env file
2. Check that your domain is verified in the Resend dashboard
3. Check `CONTACT_TO_EMAIL` is set to a real address

```bash
docker logs valentin-cuisine-app | grep -i email
```

### Uploaded images aren't showing

R2 credentials may be wrong, or the bucket isn't set to public access.

1. Double-check all `R2_*` env variables on the VPS
2. Make sure **Public Access** is enabled on the R2 bucket
3. The app will silently fall back to local storage if R2 fails — check logs

```bash
docker logs valentin-cuisine-app | grep -i r2
```

### Database migrations failed on deploy

```bash
# Run migrations manually inside the container
docker exec -it valentin-cuisine-app yarn prisma migrate deploy

# Or check the migration status
docker exec -it valentin-cuisine-app yarn prisma migrate status
```

### GitHub Actions deploy is failing

Check the workflow run logs on GitHub → **Actions**. Common causes:

- SSH key not added to VPS `authorized_keys`
- VPS secrets wrong in GitHub (IP, username)
- VPS disk full — run `df -h` on the server
- Docker not installed on VPS

### SSL certificate expired or missing

```bash
# Renew manually
certbot renew

# Check expiry date
certbot certificates
```

### Reset admin password

```bash
ssh deploy@YOUR_VPS_IP
docker exec -it valentin-cuisine-app yarn create-admin
```

This creates a new admin user. To update an existing user's password, use Prisma Studio or the Settings section in the admin panel.

---

## Technical Reference

> This section is for Claude Code and developers. It contains the exact commands and configs referenced throughout the steps above.

### Server setup commands

Run these on the VPS after first logging in as root:

```bash
apt update && apt upgrade -y
curl -fsSL https://get.docker.com | sh

# Create a non-root deploy user
useradd -m -s /bin/bash deploy
usermod -aG docker deploy
usermod -aG sudo deploy
passwd deploy

# Create deployment directories
mkdir -p /root/docker-images/valentincuisine
mkdir -p /home/deploy/valentin-cuisine
chown deploy:deploy /home/deploy/valentin-cuisine

# Set up SSH key login for the deploy user
mkdir -p /home/deploy/.ssh
nano /home/deploy/.ssh/authorized_keys   # paste the public key here
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh
```

### Generate a GitHub Actions deploy key

```bash
# On your local machine
ssh-keygen -t ed25519 -C "github-actions-valentin" -f ~/.ssh/valentin_deploy -N ""

# Add public key to VPS
ssh-copy-id -i ~/.ssh/valentin_deploy.pub deploy@YOUR_VPS_IP

# Print private key — paste as VPS_PROD_SSH_KEY GitHub secret
cat ~/.ssh/valentin_deploy
```

### Nginx config

File: `/etc/nginx/sites-available/valentincuisine.com`

```nginx
server {
    listen 80;
    server_name valentincuisine.com www.valentincuisine.com;

    location / {
        proxy_pass http://localhost:3026;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 20M;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/valentincuisine.com /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### Certbot (SSL)

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d valentincuisine.com -d www.valentincuisine.com

# Check certificate / renew manually
certbot certificates
certbot renew
```

### Full .env file reference

```env
# ─── Database ─────────────────────────────────────────────────────────────────
# Local dev
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/valentin_cuisine"
# Production (Docker — use service name "db", not "localhost")
DATABASE_URL="postgresql://postgres:yourpassword@db:5432/valentin_cuisine"

# ─── NextAuth ─────────────────────────────────────────────────────────────────
NEXTAUTH_SECRET="generate with: openssl rand -base64 32"
NEXTAUTH_URL="https://valentincuisine.com"   # http://localhost:3000 for dev

# ─── Email ────────────────────────────────────────────────────────────────────
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
CONTACT_TO_EMAIL="your@email.com"

# ─── Cloudflare R2 ────────────────────────────────────────────────────────────
R2_ACCOUNT_ID="your-cloudflare-account-id"
R2_ACCESS_KEY_ID="your-r2-access-key-id"
R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
R2_BUCKET_NAME="valentin-cuisine-media"
R2_PUBLIC_URL="https://pub-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.r2.dev"
```

### Create admin user

```bash
ssh root@YOUR_VPS_IP
docker exec -it valentin-cuisine-app yarn create-admin
```

### Key file locations

| What | Where |
|---|---|
| Next.js config | `next.config.mjs` |
| Tailwind config | `tailwind.config.ts` |
| Prisma schema | `prisma/schema.prisma` |
| DB migrations | `prisma/migrations/` |
| NextAuth config | `src/lib/auth.ts` |
| Auth middleware | `src/lib/auth-middleware.ts` |
| Prisma client | `src/lib/prisma.ts` |
| R2 storage | `src/lib/r2-storage.ts` |
| Site content helpers | `src/lib/siteContent.ts` |
| Image processing | `src/lib/image-processor.ts`, `src/lib/image-utils.ts` |
| Rate limiter | `src/lib/rate-limiter.ts` |
| Admin pages | `src/app/admin/` |
| API routes | `src/app/api/` (22 handlers) |
| Public pages | `src/app/{blog,shop,kimchi,contact,credentials}/` |
| Shared components | `src/components/` |
| Global styles | `src/styles/` |
| TypeScript types | `src/types/` |
| Docker config | `docker-compose.yml`, `Dockerfile` |
| Deploy script | `deploy-valentin-cuisine.sh` |
| GitHub workflows | `.github/workflows/main.yml`, `deploy-staging.yml` |
| Env template | `.env.example` |

### Environment variables

```
DATABASE_URL              PostgreSQL connection string
                          Local:      postgresql://postgres:pass@localhost:5432/valentin_cuisine
                          Production: postgresql://postgres:pass@db:5432/valentin_cuisine  ← "@db:" not "@localhost:"

NEXTAUTH_SECRET           JWT signing secret (openssl rand -base64 32)
NEXTAUTH_URL              Full site URL — https://valentincuisine.com in prod, http://localhost:3000 in dev

RESEND_API_KEY            Starts with re_ — from resend.com
CONTACT_TO_EMAIL          Recipient address for contact form submissions

R2_ACCOUNT_ID             Cloudflare account ID
R2_ACCESS_KEY_ID          R2 API token access key
R2_SECRET_ACCESS_KEY      R2 API token secret
R2_BUCKET_NAME            R2 bucket name
R2_PUBLIC_URL             Public URL for the bucket
```

### Database models

`User` `Account` `Session` `VerificationToken` — NextAuth tables
`Post` — posts (retired, not linked from public site)
`Product` — cakes, pastries, kimchi (name, price, available, category)
`Page` — CMS pages (slug, showInNav, navOrder)
`Reference` — customer testimonials
`SiteContent` — key/value store for editable site copy
`MediaItem` — metadata for R2-uploaded files (filename, dimensions, alt, tags)
`EmailCampaign` — email campaign records
`WaitingListSignup` — newsletter subscribers

### Conventions

- TypeScript strict mode — no `any`, no implicit nulls
- Pre-commit hooks (Husky + lint-staged) run type-check and lint on every commit; pre-push runs the full build
- Never commit `.env*` files
- Media files go to R2 in production, never to `public/uploads`
- Next.js body size limit is 10 MB (`next.config.mjs`) — keep uploads under that
- API rate limiting is applied via `src/lib/rate-limiter.ts`
- All admin routes are protected by session check in `src/lib/auth-middleware.ts`

### Additional docs in this repo

- `DEVELOPMENT.md` — development workflow detail
- `R2_SETUP.md` — Cloudflare R2 setup walkthrough
- `MEDIA_UPLOAD_README.md` — media library API and component docs
