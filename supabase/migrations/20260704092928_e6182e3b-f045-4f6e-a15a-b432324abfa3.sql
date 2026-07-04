-- ============ TABLES ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text check (role in ('seller','buyer','admin')) default 'seller',
  created_at timestamptz default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;

create table public.valuation_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  email text not null,
  full_name text,
  business_type text check (business_type in ('vr_portfolio','boutique_hotel','hotel','bnb_inn')) not null,
  units int,
  market_city text,
  market_state text,
  gross_revenue_ltm numeric,
  sde numeric,
  sde_unknown boolean default false,
  occupancy_pct numeric,
  adr numeric,
  direct_booking_pct numeric,
  avg_review_score numeric,
  owner_hours_per_week int,
  sell_timeline text check (sell_timeline in ('now','1_2_years','3_plus_years','curious')),
  source_file_url text,
  listing_url text
);
grant select, insert, update, delete on public.valuation_requests to authenticated;
grant insert on public.valuation_requests to anon;
grant all on public.valuation_requests to service_role;

create table public.valuations (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.valuation_requests(id) on delete cascade,
  created_at timestamptz default now(),
  serial text unique,
  low numeric not null,
  high numeric not null,
  multiple_used text,
  methodology text,
  readiness_score int check (readiness_score between 0 and 100),
  subscores jsonb,
  drivers jsonb,
  gaps jsonb,
  teaser_paragraph text
);
grant select, insert, update, delete on public.valuations to authenticated;
grant select, insert on public.valuations to anon;
grant all on public.valuations to service_role;

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  owner_id uuid references public.profiles(id),
  valuation_id uuid references public.valuations(id),
  status text check (status in ('draft','live','under_offer','sold','withdrawn')) default 'draft',
  business_type text not null,
  units int,
  region text,
  headline text,
  asking_low numeric,
  asking_high numeric,
  gross_revenue_ltm numeric,
  sde numeric,
  occupancy_pct numeric,
  adr numeric,
  direct_booking_pct numeric,
  avg_review_score numeric,
  readiness_score int,
  verified boolean default false,
  teaser_paragraph text
);
grant select, insert, update, delete on public.listings to authenticated;
grant select on public.listings to anon;
grant all on public.listings to service_role;

create table public.buyer_profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid references public.profiles(id),
  full_name text not null,
  email text not null,
  buyer_type text check (buyer_type in ('individual','search_fund','family_office','pe','strategic')) not null,
  budget_low numeric,
  budget_high numeric,
  target_markets text,
  proof_of_funds boolean default false,
  status text check (status in ('pending','verified','rejected')) default 'pending'
);
grant select, insert, update, delete on public.buyer_profiles to authenticated;
grant insert on public.buyer_profiles to anon;
grant all on public.buyer_profiles to service_role;

create table public.deal_room_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  listing_id uuid references public.listings(id) on delete cascade,
  buyer_name text not null,
  buyer_email text not null,
  buyer_type text,
  budget numeric,
  proof_of_funds boolean default false,
  message text,
  status text check (status in ('pending','approved','declined')) default 'pending'
);
grant select, insert, update, delete on public.deal_room_requests to authenticated;
grant insert on public.deal_room_requests to anon;
grant all on public.deal_room_requests to service_role;

-- Serial number generator
create sequence sbs_serial_seq start 137;

create or replace function public.set_valuation_serial() returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.serial := 'SBS-' || to_char(now(),'YYYY') || '-' || lpad(nextval('sbs_serial_seq')::text, 5, '0');
  return new;
end $$;

create trigger valuation_serial before insert on public.valuations
  for each row when (new.serial is null) execute function public.set_valuation_serial();

-- ============ RLS ============
alter table public.profiles enable row level security;
alter table public.valuation_requests enable row level security;
alter table public.valuations enable row level security;
alter table public.listings enable row level security;
alter table public.buyer_profiles enable row level security;
alter table public.deal_room_requests enable row level security;

create policy "anon insert valuation_requests" on public.valuation_requests for insert with check (true);
create policy "anon read valuations" on public.valuations for select using (true);
create policy "anon insert valuations" on public.valuations for insert with check (true);
create policy "public read live listings" on public.listings for select using (status = 'live');
create policy "anon insert buyer_profiles" on public.buyer_profiles for insert with check (true);
create policy "anon insert deal_room_requests" on public.deal_room_requests for insert with check (true);

create policy "own profile" on public.profiles for select using (auth.uid() = id);
create policy "owner reads own listings" on public.listings for select using (owner_id = auth.uid());
create policy "owner updates own listings" on public.listings for update using (owner_id = auth.uid());
create policy "owner inserts listings" on public.listings for insert with check (owner_id = auth.uid() or owner_id is null);
create policy "owner reads own deal requests" on public.deal_room_requests for select
  using (exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid()));
create policy "owner updates own deal requests" on public.deal_room_requests for update
  using (exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid()));

-- ============ SEED DATA ============
insert into public.listings
(status, business_type, units, region, headline, asking_low, asking_high, gross_revenue_ltm, sde, occupancy_pct, adr, direct_booking_pct, avg_review_score, readiness_score, verified, teaser_paragraph) values
('live','vr_portfolio',12,'Sedona, AZ','12-home luxury vacation rental portfolio, red rock views',2100000,2600000,1180000,505000,78,415,34,4.9,86,true,'A tightly run 12-home luxury portfolio in one of the Southwest''s most supply-constrained markets. Fully professionally managed with documented SOPs, a 4.9 average across 2,300+ reviews, and 34% of revenue booked direct. Owner works under 5 hours per week; the team and playbooks convey with the sale.'),
('live','boutique_hotel',14,'Napa Valley, CA','14-key boutique hotel, wine country',4800000,5600000,2350000,890000,71,486,58,4.8,79,true,'A 14-key boutique property minutes from tasting rooms, with a strong direct-booking engine (58% of revenue) and consistent weekday corporate retreat business smoothing seasonality. Recently renovated; real estate included. Books are accountant-maintained with three years of clean P&Ls.'),
('live','vr_portfolio',8,'Gulf Shores, AL','8-condo beachfront rental business',950000,1200000,620000,248000,74,289,22,4.7,68,true,'Eight beachfront condos under long-term management agreements with strong repeat-guest revenue. Solid earner with clear upside: direct bookings are only 22% and dynamic pricing was adopted just last year. Priced for a buyer who wants proven cash flow with obvious levers left to pull.'),
('live','bnb_inn',9,'Stowe, VT','9-room historic inn near ski lifts',1650000,1950000,780000,310000,66,342,64,4.9,72,true,'A beloved 9-room inn with a 40-year operating history, strong shoulder-season leaf traffic, and 64% direct bookings driven by a repeat-guest list of 6,000+. Real estate included. The owners are retiring after two decades and will support a full season of transition.'),
('live','hotel',31,'Hill Country, TX','31-key independent hotel with event barn',6900000,7800000,3400000,1150000,69,301,47,4.6,64,true,'A 31-key independent with a high-margin events business (weddings booked 14 months out) that most hotel buyers will under-model. Family-owned; financials are clean but owner involvement is high — priced accordingly, with a clear path to professional management.'),
('live','vr_portfolio',22,'Smoky Mountains, TN','22-cabin portfolio, management company included',3800000,4500000,2050000,860000,81,262,29,4.8,83,true,'Twenty-two cabins plus the management company that runs them — a true turnkey platform acquisition in America''s highest-demand cabin market. 81% occupancy against a market average in the low 60s. Staff of six conveys; owner is relocating abroad.'),
('under_offer','boutique_hotel',10,'Charleston, SC','10-key design hotel, historic district',3900000,4400000,1900000,720000,77,442,61,4.9,88,true,'A design-forward 10-key in the historic district with press coverage, a wait-listed rooftop, and 61% direct revenue. Under offer within 19 days of listing.');
