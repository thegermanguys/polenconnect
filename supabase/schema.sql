-- =============================================================================
-- PolenConnect Germany — Supabase / PostgreSQL schema
--
-- Run this once: Supabase Dashboard -> SQL Editor -> New query -> paste this
-- whole file -> Run. Safe to re-run on a fresh project; it will error if the
-- tables already exist (drop them first if you need to start over).
--
-- Scope: this covers exactly what the app renders today — cities,
-- categories, clubs (sports clubs + cultural organizations + music groups,
-- unified — see note below), restaurants, and events. Jobs, housing,
-- lawyers, doctors, and universities were sketched in an earlier draft of
-- this file but have no pages in the app yet, so they're left out until
-- those are actually built — add them later following the same pattern.
-- =============================================================================

create extension if not exists "pgcrypto"; -- gives us gen_random_uuid()

create type moderation_status as enum ('pending', 'approved', 'rejected');

-- ---------------------------------------------------------------------------
-- Cities — reference data (~70 German cities seeded). Rarely changes; the
-- Supabase Table Editor (Dashboard -> Table Editor -> cities) is the easiest
-- way to tweak one, no custom admin form needed for this table.
--
-- community_count / business_count / event_count / member_count are
-- editorial estimates shown on the homepage and map ("42 Communities" etc.),
-- not a live count of rows below — Postgres already computes the real counts
-- on demand via the Club/Restaurant/Event tables, so keep these as
-- occasionally-updated marketing figures, edited by hand.
-- ---------------------------------------------------------------------------
create table cities (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  state text not null,
  lat double precision not null,
  lng double precision not null,
  hero_image text,
  blurb text,
  community_count int not null default 0,
  business_count int not null default 0,
  event_count int not null default 0,
  member_count int not null default 0,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Categories — football, volleyball, regional-associations, parishes, etc.
-- Also reference data; manage via the Table Editor.
-- ---------------------------------------------------------------------------
create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  icon text not null,          -- lucide-react icon name
  category_group text not null, -- sports | community | food | life
  description text
);

-- ---------------------------------------------------------------------------
-- Clubs — sports clubs, cultural organizations, AND music groups all live in
-- this one table. The app has always treated these as a single `Club` type
-- distinguished by category_slug (see lib/types.ts), so this mirrors that
-- instead of forcing a split the front-end doesn't use.
-- ---------------------------------------------------------------------------
create table clubs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  city_slug text not null references cities(slug),
  category_slug text not null references categories(slug),
  logo text,
  cover_image text,
  description text,
  social jsonb not null default '{}'::jsonb, -- { instagram, facebook, tiktok, whatsapp, website }
  phone text not null default '',
  email text not null default '',
  maps_url text not null default '',
  is_featured boolean not null default false,
  status moderation_status not null default 'pending',
  -- Sports-club-specific (blank for cultural orgs / music groups):
  captain_name text not null default '',
  practice_location text not null default '',
  practice_time text not null default '',
  member_count int not null default 0,
  -- Cultural-org / music-group-specific (blank for sports clubs):
  contact_person text not null default '',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Restaurants
-- ---------------------------------------------------------------------------
create table restaurants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  city_slug text not null references cities(slug),
  category text not null default 'Restaurant',
  logo text,
  photos text[] not null default '{}',
  description text,
  opening_hours jsonb not null default '[]'::jsonb, -- [{ day, hours }]
  address text not null default '',
  maps_url text not null default '',
  social jsonb not null default '{}'::jsonb,
  phone text not null default '',
  rating numeric(2,1) not null default 0,
  review_count int not null default 0,
  is_premium boolean not null default false,
  status moderation_status not null default 'pending',
  cuisine text[] not null default '{}',
  menu_highlights jsonb not null default '[]'::jsonb, -- [{ name, price, description }]
  delivery jsonb not null default '[]'::jsonb,         -- [{ partner, url }]
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Events
-- ---------------------------------------------------------------------------
create table events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  city_slug text not null references cities(slug),
  organizer text not null default '',
  poster text,
  location text not null default '',
  maps_url text not null default '',
  start_date date not null,
  end_date date,
  description text,
  category text not null default 'other', -- festival | sports | cultural | networking | religious | concert | other | offer
  festival_tag text,                      -- Wigilia | Wielkanoc | Dozynki | Andrzejki | Constitution Day | Independence Day | Corpus Christi | Mikolajki | Football | Music | Volleyball | Offer | Other
  price text not null default '',
  register_url text not null default '',
  is_featured boolean not null default false,
  status moderation_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- =============================================================================
-- Indexes — matching how the app actually queries (by city, by city+category,
-- by status, events sorted by date).
-- =============================================================================
create index idx_clubs_city on clubs (city_slug);
create index idx_clubs_category on clubs (category_slug);
create index idx_clubs_status on clubs (status);
create index idx_restaurants_city on restaurants (city_slug);
create index idx_restaurants_status on restaurants (status);
create index idx_events_city on events (city_slug);
create index idx_events_status on events (status);
create index idx_events_start_date on events (start_date);

-- =============================================================================
-- Row Level Security
--
-- There's no live user-login system wired up yet (Clerk is planned but not
-- connected — see README), so this deliberately does NOT try to do
-- per-owner RLS policies keyed off auth.uid(). Instead:
--
--   - The public site reads with the anon key. RLS below restricts it to
--     "approved" rows only — a pending or rejected submission is invisible
--     to everyone except the admin.
--   - ALL writes (public submissions AND admin add/approve/reject) go
--     through Next.js Server Actions using the service role key, which
--     bypasses RLS entirely and never reaches the browser. That's why there
--     are no insert/update/delete policies below for anon/authenticated —
--     none are needed, and adding none is safer than adding loose ones.
--
-- If/when you wire up real accounts (Clerk or Supabase Auth) and want club
-- owners to edit their own listing directly from the browser, that's the
-- point to add owner_id columns + auth.uid()-based policies.
-- =============================================================================
alter table cities enable row level security;
alter table categories enable row level security;
alter table clubs enable row level security;
alter table restaurants enable row level security;
alter table events enable row level security;

create policy "Public can read cities" on cities
  for select using (true);
create policy "Public can read categories" on categories
  for select using (true);
create policy "Public can read approved clubs" on clubs
  for select using (status = 'approved');
create policy "Public can read approved restaurants" on restaurants
  for select using (status = 'approved');
create policy "Public can read approved events" on events
  for select using (status = 'approved');
