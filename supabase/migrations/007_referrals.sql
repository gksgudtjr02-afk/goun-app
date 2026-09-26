alter table profiles add column if not exists referred_by uuid references auth.users(id);
alter table profiles add column if not exists referral_rewarded boolean not null default false;
