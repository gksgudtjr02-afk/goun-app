alter table profiles add column if not exists ai_ticket_free_used integer not null default 0;

-- profiles had select/insert policies but no update policy, so point balance
-- updates (referral rewards, ticket spending) were silently blocked by RLS.
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
