# PT. Pakindo Impex Perkasa — Website

Indonesian export/import company website. Next.js (App Router) + TypeScript +
Tailwind CSS v4, PostgreSQL via Prisma, and a machine-translated i18n /
country switcher for buyers in India, Pakistan, Iran, Nepal, Bangladesh,
Singapore, Malaysia, and China.

See [`assets/CONTENT.md`](assets/CONTENT.md) for the full content brief this
site was built against — in particular the rule that **no company fact,
product spec, certification, or export market is invented**. Anything not
yet verified is shown as an explicit `[VERIFY: ...]` placeholder.

## Tech stack

- **Framework**: Next.js 16 (App Router, Turbopack), React 19, TypeScript
- **Styling**: Tailwind CSS v4 (design tokens in `src/app/globals.css`)
- **i18n**: next-intl — English is the source of truth; `hi`, `ur`, `fa`,
  `ne`, `bn`, `zh`, `ms` are AI/machine-translated (see "i18n scope" below)
- **Database**: PostgreSQL via Prisma ORM (`prisma/schema.prisma`)
- **Email**: Resend (inactive until `RESEND_API_KEY` is set — see below)
- **Validation**: Zod (shared client/server schemas in `src/lib/validations.ts`)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

This starts Postgres 16 matching the connection string already in `.env`.
If you'd rather use your own Postgres instance (local, Supabase, Neon,
Railway, RDS, ...), just point `DATABASE_URL` in `.env` at it instead.

### 3. Create the schema and seed data

```bash
npm run db:push
npm run db:seed
```

Seeding creates the one verified product (Areca Nut) and three sample blog
articles — see `prisma/seed.ts` for why only these are live (everything else
in the content brief is an unverified placeholder, not a fake page).

### 4. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:push` | Push `prisma/schema.prisma` to the database (dev) |
| `npm run db:migrate` | Create a migration (use instead of `db:push` once you have real data to preserve) |
| `npm run db:seed` | Re-run `prisma/seed.ts` |
| `npm run db:studio` | Open Prisma Studio |

## Environment variables

Copy `.env.example` to `.env` and fill in real values. Nothing in this
project reads secrets on the client — server-only env vars are only ever
used inside API routes / Server Components.

- `DATABASE_URL` — Postgres connection string
- `RESEND_API_KEY`, `NOTIFICATIONS_FROM_EMAIL`, `NOTIFICATIONS_TO_EMAIL` —
  optional email notifications for the Request a Quote / Contact forms.
  **Inactive until set** — see `src/lib/email.ts`. Until then, submissions
  are still saved to Postgres; nothing is silently lost.
- `NEXT_PUBLIC_SITE_URL` — used for canonical URLs, sitemap, and OG tags

## i18n scope (important)

The Country / Language switcher in the header covers 8 locales. To keep
translation quality honest and avoid overbuilding:

- **Fully translated** (nav, footer, and the entire homepage): English,
  Hindi, Urdu, Persian, Nepali, Bengali, Chinese, Malay.
- **English only for now**: About, Products, Gallery, Blog, FAQ, Contact,
  and Request a Quote page *bodies*. These pages still render
  correctly under every locale (routing, header, footer all localize), but
  show a small notice ("This page is shown in English") when viewed in a
  non-English locale. This is a deliberate scope decision, not a bug — see
  `src/components/ui/EnglishContentNotice.tsx`.
- All non-English translations were AI-generated (per the project's chosen
  approach) and should be reviewed by a native speaker before being treated
  as final marketing copy. This is stated in the switcher UI itself.

Extending translation coverage to the remaining pages just means adding more
namespaces to `src/messages/*.json` and swapping hardcoded English strings
in those page components for `useTranslations()` calls — the i18n
architecture (`src/i18n/`, `middleware` → `proxy.ts`) already supports it.

## Data model / content policy

- `Product` and `Article` live in Postgres (see `prisma/schema.prisma`) so a
  future admin panel can manage them directly.
- Only **Areca Nut** is a real, indexable product page — it's the one
  product named in the content brief's hero copy. The other placeholder
  categories render as non-linked "coming soon" cards rather than fake
  product pages with invented specs.
- Every unverified field (grade, MOQ, HS code, packaging, loading port,
  contact details, etc.) is rendered as a visible `[VERIFY: ...]` placeholder
  — see `src/lib/constants.ts` (`COMPANY`) and `prisma/seed.ts`.
- Before launch, run through the verification checklist in
  `assets/CONTENT.md` section 54 with the business owner and replace every
  `[VERIFY: ...]` placeholder with confirmed information.

## Security notes

- Form input is validated server-side with Zod (`src/lib/validations.ts`),
  regardless of client-side validation.
- Both API routes use a honeypot field and a simple in-memory rate limiter
  (`src/lib/rate-limit.ts`) — sufficient for a single-instance deployment;
  swap for a shared store (e.g. Redis) if you scale to multiple instances.
- Article body HTML is sanitized (`src/lib/sanitize.ts`, DOMPurify) before
  rendering, as defense-in-depth for when a future admin panel allows
  editing article content directly.
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`) are set in `next.config.ts`.
- `npm audit` currently reports advisories under `deepmerge-ts` /
  `@prisma/config`, pulled in transitively by the `prisma` **CLI**
  (devDependency, used for `generate`/`migrate`/`studio`). `@prisma/client`
  — the only Prisma package shipped in the production server bundle — does
  not depend on them. Re-run `npm audit` periodically and upgrade `prisma`
  when a fixed release ships.

## Deployment

No platform-specific code — this runs as a standard Next.js server
(`next start`) or on Vercel with zero extra config. Whichever you pick,
Postgres needs to be reachable from wherever the app runs, and the DB-backed
routes (`/`, `/products`, `/products/[slug]`, `/blog`, `/blog/[slug]`,
`/sitemap.xml`) are intentionally rendered per-request (`export const
dynamic = "force-dynamic"`) rather than at build time, since build
environments won't have a live database connection.

## What's next (deferred)

- Admin panel for managing products, articles, and viewing form submissions
  (explicitly out of scope for this pass — see project brief).
- Native-speaker review of the 7 non-English translations.
- Replacing every `[VERIFY: ...]` placeholder once the business owner
  confirms real company/product/contact information.
- Team section (About page): currently placeholder-ready cards
  (`src/components/sections/TeamSection.tsx`) — swap in real names/roles
  once confirmed.
- Brand scroller (`src/components/ui/BrandScroller.tsx`): renders nothing
  until `src/data/brands.ts`'s `BRANDS` array is populated with real,
  verified partner/client logos (image files under `public/images/brands/`).
