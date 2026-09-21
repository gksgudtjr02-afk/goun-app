create table if not exists feed_items (
  id uuid primary key default gen_random_uuid(),
  flag text not null,
  name text not null,
  likes text not null,
  cat text not null,
  hot boolean not null default false,
  caption text not null,
  created_at timestamptz not null default now()
);

alter table feed_items enable row level security;

create policy "Anyone can view feed items"
  on feed_items for select
  using (true);

insert into feed_items (flag, name, likes, cat, hot, caption) values
  ('🇰🇷', '민지', '12.4k', 'base', false, '"이 쿠션 하나로 끝! 완전 강추"'),
  ('🇺🇸', 'Taylor', '8.1k', 'lip', false, '"이 립 컬러 완전 내 스타일"'),
  ('🇯🇵', 'Sakura', '21.7k', 'skin', true, '"세럼 하나로 광채 피부 완성"'),
  ('🇻🇳', 'Linh', '5.6k', 'base', false, '"베이스 커버력 실화냐"'),
  ('🇰🇷', '하은', '3.2k', 'lip', false, '"틴트 발색 미쳤어요"'),
  ('🇩🇪', 'Anna', '9.9k', 'skin', false, '"수분 폭탄 스킨케어 루틴"');
