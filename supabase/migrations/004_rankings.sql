create table if not exists rankings (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('look','creator')),
  rank int not null,
  flag text not null,
  name text not null,
  likes text not null,
  title text not null,
  created_at timestamptz not null default now()
);

alter table rankings enable row level security;

create policy "Anyone can view rankings"
  on rankings for select
  using (true);

insert into rankings (category, rank, flag, name, likes, title) values
  ('look', 1, '🇯🇵', 'Sakura', '21.7k', '광채 스킨케어 루틴'),
  ('look', 2, '🇰🇷', '민지', '12.4k', '코랄 쿠션 메이크업'),
  ('look', 3, '🇺🇸', 'Taylor', '8.1k', '데일리 립 컬러'),
  ('look', 4, '🇩🇪', 'Anna', '6.3k', '수분 폭탄 루틴'),
  ('look', 5, '🇻🇳', 'Linh', '5.6k', '커버력 베이스 메이크업'),
  ('creator', 1, '🇯🇵', 'Sakura', '포인트 8.2만', '파워 크리에이터'),
  ('creator', 2, '🇰🇷', '민지', '포인트 4.2만', '파워 크리에이터'),
  ('creator', 3, '🇺🇸', 'Taylor', '포인트 3.1만', '일반 크리에이터');
