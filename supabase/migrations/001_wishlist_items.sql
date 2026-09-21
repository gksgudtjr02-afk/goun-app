-- 위시리스트 저장용 테이블
create table if not exists wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  brand text not null,
  name text not null,
  price text not null,
  color text not null,
  type text not null,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

alter table wishlist_items enable row level security;

create policy "Users can view own wishlist"
  on wishlist_items for select
  using (auth.uid() = user_id);

create policy "Users can insert own wishlist"
  on wishlist_items for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own wishlist"
  on wishlist_items for delete
  using (auth.uid() = user_id);
