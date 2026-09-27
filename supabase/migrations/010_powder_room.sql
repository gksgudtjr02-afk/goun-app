-- "파우더룸" (Powder Room): every user's personal space where their beauty-lab /
-- influencer-lookfinder results get posted, replacing the old creator-only video feed.

create table if not exists feed_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  handle text,
  source_type text not null check (source_type in ('lookfinder', 'beautylab')),
  image_url text not null,
  caption text,
  products jsonb not null default '[]'::jsonb,
  likes integer not null default 0,
  created_at timestamptz not null default now()
);

alter table feed_posts enable row level security;

create policy "Anyone can view feed posts"
  on feed_posts for select
  using (true);

create policy "Users can create own feed posts"
  on feed_posts for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own feed posts"
  on feed_posts for delete
  using (auth.uid() = user_id);

-- Storage bucket for the photos behind feed_posts.image_url. Public read (the
-- home feed and /c/[handle] pages are shown to logged-out visitors too);
-- writes are restricted to each user's own "<user_id>/..." folder.
insert into storage.buckets (id, name, public)
values ('feed-photos', 'feed-photos', true)
on conflict (id) do nothing;

-- storage.objects already has RLS enabled by default on every Supabase
-- project, and only the storage system role owns that table — so we don't
-- (and can't) run `alter table storage.objects enable row level security`
-- here; we only add the policies below.

create policy "Anyone can view feed photos"
  on storage.objects for select
  using (bucket_id = 'feed-photos');

create policy "Users can upload their own feed photos"
  on storage.objects for insert
  with check (bucket_id = 'feed-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own feed photos"
  on storage.objects for delete
  using (bucket_id = 'feed-photos' and auth.uid()::text = (storage.foldername(name))[1]);
