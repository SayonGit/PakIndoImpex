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
- **Email**: SMTP via Nodemailer — configured from `/admin/settings`, not env vars
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
| `npm run translate` | Regenerate every translated locale file from the current `en.json` (see [i18n scope](#i18n-scope-important)) |

## Environment variables

Copy `.env.example` to `.env` and fill in real values. Nothing in this
project reads secrets on the client — server-only env vars are only ever
used inside API routes / Server Components.

- `DATABASE_URL` — Postgres connection string
- Email notifications for the Request a Quote / Contact forms are
  configured from `/admin/settings` (SMTP host/port/credentials), not env
  vars — see `src/lib/email.ts`. **Inactive until set up there.** Until
  then, submissions are still saved to Postgres; nothing is silently lost.
- `NEXT_PUBLIC_SITE_URL` — used for canonical URLs, sitemap, and OG tags
- `GEMINI_API_KEY` — only needed to run `npm run translate` (see below). Free
  to get, no credit card required. Never read by the site itself at runtime.

## i18n scope (important)

The Country / Language switcher in the header covers 8 locales. To keep
translation quality honest and avoid overbuilding:

- **Fully translated** (nav, footer, and the entire homepage): English,
  Hindi, Urdu, Persian, Nepali, Bengali, Chinese, Malay.
- **English only for now**: About, Gallery, Blog, and Contact page *bodies*
  (there are no separate Products or FAQ pages, and Request a Quote is now
  a global modal rather than a page — see "Data model / content policy"
  below). These pages still render
  correctly under every locale (routing, header, footer all localize), but
  show a small notice ("This page is shown in English") when viewed in a
  non-English locale. This is a deliberate scope decision, not a bug — see
  `src/components/ui/EnglishContentNotice.tsx`.
- All non-English translations were AI-generated (per the project's chosen
  approach) and should be reviewed by a native speaker before being treated
  as final marketing copy. This is stated in the switcher UI itself.

Extending translation coverage to the remaining pages just means adding more
namespaces to `src/messages/en.json` and swapping hardcoded English strings
in those page components for `useTranslations()` calls — the i18n
architecture (`src/i18n/`, `middleware` → `proxy.ts`) already supports it.

### Keeping translations in sync (`npm run translate`)

**`src/messages/en.json` is the only locale file anyone should hand-edit.**
Every other `src/messages/<locale>.json` is *generated* by
`scripts/translate-messages.ts` via the Gemini API (Google's free tier) —
treat them like a lockfile, not source you write by hand.

```bash
# After changing copy in en.json, bring every other language back in sync:
npm run translate

# Add a brand-new language (writes the file + validates its structure
# against en.json; prints the src/i18n/routing.ts lines to add):
npm run translate -- ja "Japanese" "日本語"
npm run translate -- ar "Arabic" "العربية" --rtl
```

Requires `GEMINI_API_KEY` in `.env` — a **free** key from
[Google AI Studio](https://aistudio.google.com/apikey): sign in with any
Google account and generate one, no credit card or billing setup needed.
This makes the workflow usable by whoever ends up maintaining the site
day-to-day, not just someone with a paid AI API account.

The script uses `gemini-3.5-flash-lite` (Google's high-throughput, most
free-tier-friendly model) and automatically retries on transient rate-limit
errors with backoff, spacing requests out to stay within the free tier's
per-minute limit. If you exhaust the free tier's *daily* request quota
(rare for a single resync of ~8 locales), the script fails fast with a
clear message instead of retrying pointlessly — just wait for the quota to
reset (~24h) or use a different key.

The script re-translates the full file each run and hard-fails if the
result's JSON key structure doesn't exactly match `en.json` (same keys,
same nesting, same array lengths) — so a malformed or incomplete
translation never silently gets written. Generated files are still
committed to the repo (not gitignored): Next.js needs them to exist at
build/request time, and production builds shouldn't depend on a live AI
API call. Re-run the script and commit the diff whenever `en.json`
changes.

## Data model / content policy

- `Product` and `Article` live in Postgres (see `prisma/schema.prisma`) so a
  future admin panel can manage them directly, even though there's no
  public-facing product page today (see below).
- There are no individual product pages (`/products`, `/products/[slug]`
  were removed). All product content — Split Betel Nut, Whole Betel Nut,
  Roasted Areca Nut, and an "Other Products (By Request)" card — lives only
  in the homepage's Products section (`src/components/sections/
  ProductsPreview.tsx`), anchored at `#products`. General "Products"
  navigation (header/footer nav, hero secondary CTA, 404 page, blog
  "related product" links) points to `/#products`; the three product
  cards' own CTAs open a pre-filled WhatsApp chat instead (see
  `COMPANY.whatsapp` / `WHATSAPP_LINK` in `src/lib/constants.ts`), and
  "Other Products (By Request)" opens the Request a Quote modal. **Areca
  Nut** remains the one real, verified product record in Postgres — it's
  the one product named in the content brief's hero copy — it just isn't
  rendered as its own page anymore.
- **Request a Quote is a global modal, not a page** (the old
  `/request-a-quote` route was removed). Every "Request a Quote" CTA
  sitewide opens `src/components/quote/QuoteModal.tsx` via
  `QuoteModalProvider`/`useQuoteModal` (`src/components/quote/
  QuoteModalContext.tsx`) — use `<QuoteModalTrigger>` (button-styled) or
  `<QuoteModalTextTrigger>` (plain-text-styled) in place of a
  `<Button href="/request-a-quote">`. The modal is deliberately **not**
  dismissible by clicking the backdrop or pressing Escape — only its close
  button closes it, per explicit product decision.
- A floating WhatsApp button (`src/components/layout/WhatsAppButton.tsx`)
  and scroll-to-top button (`src/components/layout/ScrollToTopButton.tsx`)
  are fixed at the bottom-right of every page, mounted once in
  `src/app/[locale]/layout.tsx`.
- **There is no separate FAQ page either** (the old `/faq` route was
  removed) — the homepage's FAQ section (`src/components/sections/
  FaqPreviewSection.tsx`) is the only FAQ content, anchored at `#faq`; the
  "FAQ" nav link points to `/#faq`. Its `FAQPage` JSON-LD (`faqJsonLd` in
  `src/lib/structured-data.ts`) now renders from `src/app/[locale]/
  page.tsx` instead of a dedicated page.
- Every unverified product-level field (grade, MOQ, HS code, packaging,
  loading port, etc.) is rendered as a visible `[VERIFY: ...]` placeholder
  — see `prisma/seed.ts`. `COMPANY` in `src/lib/constants.ts` (WhatsApp,
  email, office address, business hours) is now fully verified — no
  `[VERIFY: ...]` placeholders remain there.
- Before launch, run through the verification checklist in
  `assets/CONTENT.md` section 54 with the business owner and replace every
  remaining `[VERIFY: ...]` placeholder with confirmed information.

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
routes (`/`, `/blog`, `/blog/[slug]`, `/sitemap.xml`) are intentionally
rendered per-request (`export const dynamic = "force-dynamic"`) rather than
at build time, since build environments won't have a live database
connection.

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
