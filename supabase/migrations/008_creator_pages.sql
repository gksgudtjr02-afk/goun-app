create table if not exists creator_pages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  handle text not null unique,
  bio text,
  created_at timestamptz not null default now()
);

create table if not exists creator_picks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  brand text not null,
  name text not null,
  price text not null,
  color text not null,
  type text not null,
  created_at timestamptz not null default now()
);

alter table creator_pages enable row level security;
alter table creator_picks enable row level security;

-- Public pages: anyone (including logged-out visitors) can view a creator's
-- handle/bio and picks, but only the owner can create/edit their own.
create policy "Anyone can view creator pages"
  on creator_pages for select
  using (true);

create policy "Users can create own creator page"
  on creator_pages for insert
  with check (auth.uid() = user_id);

create policy "Users can update own creator page"
  on creator_pages for update
  using (auth.uid() = user_id);

create policy "Anyone can view creator picks"
  on creator_picks for select
  using (true);

create policy "Users can add own creator picks"
  on creator_picks for insert
  with check (auth.uid() = user_id);

create policy "Users can remove own creator picks"
  on creator_picks for delete
  using (auth.uid() = user_id);
