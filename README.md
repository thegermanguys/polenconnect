# PolenConnect Germany 🇵🇱🇩🇪

**The Home of Poles in Germany.**

The largest online platform connecting Poles across Germany — sports clubs, communities,
student associations, restaurants, grocery stores, jobs, housing, events, lawyers, and doctors,
all in one place.

## Tech stack

- **Next.js 15** (App Router, Server Components, `generateStaticParams`, `generateMetadata`)
- **TypeScript** throughout
- **Tailwind CSS** with a custom design-token system (see `app/globals.css` / `tailwind.config.ts`)
- **shadcn-style UI primitives** hand-built on Radix UI (`components/ui`)
- **Framer Motion** for micro-interactions
- **Lucide** icons
- Prepared for **Supabase / PostgreSQL**, **Clerk**, **Cloudinary**, and **Google Maps**

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase keys + ADMIN_PASSWORD — see below
npm run dev
```

The site is backed by a real Supabase/Postgres database — see **"Connecting the
database"** below for the one-time setup (create a project, run the schema,
seed your existing data). Until `.env.local` is filled in, pages that query
Supabase will render empty rather than erroring, but nothing will actually
work end to end — the setup below takes about five minutes.

## Project structure

```
app/                          Next.js App Router routes
  cities/[city]/[category]/   Club/group listings, filtered by city + category
  restaurants/[slug]/
  events/[slug]/
  search/                     Global unified search
  map/                        Illustrative interactive map (swap for Google Maps)
  submit/                     Public community submission form -> status: 'pending'
  submit/actions.ts           Server Action: inserts the public submission
  admin/                      Approvals queue, management tables, direct add-new forms
  admin/actions.ts            Server Actions: approve/reject/create/logout (service-role client)
  admin/login/                Interim password gate for /admin
components/
  ui/                         Reusable primitives (button, card, badge, tabs, input…)
  layout/                     Navbar, footer, theme provider/toggle
  home/                       Home-page sections
  shared/                     Cross-page cards (city, club, business, event…)
  submit/submit-form.tsx      Client-side category-tab form, posts to submit/actions.ts
  map/, dashboard/            Client components fed by their server-component page wrapper
lib/
  types.ts                    Canonical domain types — mirrors supabase/schema.sql
  data/                       Async Supabase queries, one file per entity (public, approved-only)
  admin/                      Admin-only queries + session/password helpers (service-role client)
  search.ts                   Site-wide search, queries Supabase directly
  supabase/client.ts          Browser Supabase client (anon key)
  supabase/server.ts          Server Component Supabase client (anon key, cookie-aware)
  supabase/admin.ts           Service-role Supabase client — server-only, bypasses RLS
middleware.ts                 Gates /admin behind the ADMIN_PASSWORD session cookie
supabase/schema.sql           Full Postgres schema, RLS policies, and indexes
supabase/seed-data/*.json     The original dummy data, extracted, for scripts/seed.ts
scripts/seed.ts               One-time (re-runnable) load of seed-data/ into Supabase
```

## Design system

The visual identity is drawn from the actual subject rather than generic defaults:

- **Color** — the national flag's white and red (`--red`) anchor the palette, with a dark graphite
  (`--graphite`) for headers/dark sections and a gold accent (`--gold`, echoing the crown on the
  national eagle, used in festival contexts) without reproducing the emblem itself.
- **Type** — Fraunces (display serif, used with restraint for headings) paired with Inter
  (body/UI) and IBM Plex Mono (labels, stats, eyebrows).
- **Signature element** — a two-colour `.bicolor-strip` (in `globals.css`), based on the flag's
  own white-over-red band order, used as the section divider throughout the site instead of a
  plain hairline rule. The navbar/footer mark (`components/shared/logo-mark.tsx`) is a
  self-contained SVG — a white/red disc with a small gold accent — so no binary logo asset is
  required.
- Full dark mode via `next-themes`, class-based Tailwind dark variant.


## Connecting the database (one-time setup)

1. **Create a Supabase project** at [supabase.com](https://supabase.com) (free tier is plenty to
   start).
2. **Run the schema** — Dashboard → SQL Editor → New query → paste the whole contents of
   `supabase/schema.sql` → Run.
3. **Get your keys** — Project Settings → API. Copy the Project URL, the `anon` `public` key, and
   the `service_role` key.
4. **Set env vars** — `cp .env.example .env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and a long random `ADMIN_PASSWORD`
   (this last one gates `/admin` — see below). Add the same variables in your hosting provider's
   dashboard (e.g. Vercel → Settings → Environment Variables) for production.
5. **Seed data — real clubs & restaurants, illustrative events** — `npm install`, then `npm run
   seed`. This loads `supabase/seed-data/*.json`: 69 German cities, 9 categories, and:
   - **12 clubs/associations** — real, publicly documented organizations found via web search:
     Polish-founded football clubs (FC Polonia Berlin, KS Polonia Hamburg), Polonia associations
     (Kongres Polonii Niemieckiej, Związek Polaków w Niemczech, Polonica Köln), Polish Catholic
     Mission parishes (PMK Berlin, Frankfurt, Munich), and Polish Saturday schools (ORPEG Munich,
     PMK Hamburg's Szkoła Sobotnia). Only verified public facts are included — no invented contact
     names, emails, or phone numbers for these real organizations.
   - **9 restaurants** — real, named Polish restaurants with verified addresses (Pierogarnia and
     Polish Dainty in Berlin, Pani Smak in Hamburg, MaXimA in Cologne, Polka in Stuttgart, Klußka
     in Düsseldorf, etc.), sourced from restaurant review sites and each restaurant's own site.
   - **10 events** — these are **illustrative placeholders only** (fictional dates/venues for
     recurring occasions like Wigilia, Dożynki, and Andrzejki) since real upcoming event listings
     change constantly and aren't something a one-time web search can responsibly capture as fact.

   ⚠️ **Before you launch**, verify every real club/restaurant listing is still accurate (hours,
   phone numbers, and any organization change over time), and — especially for the community
   associations and parishes — reach out to let them know they're listed and invite them to claim
   or correct their entry via `/admin`. Logos are generated via ui-avatars.com and photos via
   picsum.photos as stand-ins until you have real images. Safe to re-run `npm run seed`; it
   upserts by `slug`.
6. **Run it** — `npm run dev`, then check a few pages (`/clubs`, `/restaurants`, `/events`) to
   confirm they're reading from Supabase.

From here, **adding a new restaurant, club, or event never touches code again**:

- As the site owner, sign in at `/admin/login` with `ADMIN_PASSWORD`, then use the "Add a new…"
  form on the Clubs, Restaurants, or Events tab — it publishes immediately.
- Anyone else can use `/submit` — their entry lands in the Approvals tab as `pending` until you
  approve or reject it.
- Cities and categories change rarely; the fastest way to add or tweak one is the **Table Editor**
  in the Supabase dashboard directly (no form needed for those two).

Pages are rendered dynamically (`export const dynamic = "force-dynamic"`) specifically so new
rows show up on a normal page refresh — no rebuild or redeploy required.

## Still ahead — not wired up yet

1. **Clerk** — set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY`, wrap `app/layout.tsx`
   in `<ClerkProvider>`, and swap the placeholder forms in `app/sign-in` / `app/sign-up` for
   `<SignIn />` / `<SignUp />`. Once real accounts exist, `/admin` can move from the interim
   password gate to per-user roles, and `/dashboard` can show the signed-in owner's actual club
   instead of a preview of the first one.
2. **Cloudinary** — set the three `CLOUDINARY_*` env vars and replace the mock upload buttons in
   `app/dashboard/page.tsx` with an upload widget. Until then, the admin "Add new" forms take a
   plain image URL (paste a link, or a Supabase Storage public URL).
3. **Google Maps** — set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and replace the illustrative SVG in
   `app/map/page.tsx` with `@vis.gl/react-google-maps` (or `@react-google-maps/api`), reusing the
   same `cities` data and `lat`/`lng` fields.
4. **Jobs, housing, lawyers, doctors, universities** — an earlier draft of `schema.sql` sketched
   tables for these, but no pages exist for them yet. Add a table (same conventions: `slug`,
   `city_slug` FK, `status`), a `lib/data/*.ts` file, and app routes following the restaurants
   pattern when you're ready to build these out.

## Moderation hooks in the data model

- `clubs`, `restaurants`, and `events` all carry a `status: 'pending' | 'approved' | 'rejected'`
  column. RLS restricts the public (anon-key) client to `status = 'approved'` only — the
  `/admin` Approvals tab is the front-end for flipping that status. All writes (public
  submissions and admin actions alike) go through Server Actions using the Supabase
  **service role** key, which bypasses RLS; the anon key is never used for writes.
- `is_featured` on clubs/events and `is_premium` on restaurants are ready for **Featured
  Clubs**/**Sponsored Events**/**Premium Listings** without a schema change — just gate the
  checkbox behind a paid tier in the admin form.

## Scripts

```bash
npm run dev        # start the dev server
npm run build       # production build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run seed         # load supabase/seed-data/*.json into your Supabase project
```
