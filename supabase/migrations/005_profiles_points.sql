create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  points integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists point_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  amount integer not null,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table point_history enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can view own point history"
  on point_history for select
  using (auth.uid() = user_id);

create policy "Users can insert own point history"
  on point_history for insert
  with check (auth.uid() = user_id);
