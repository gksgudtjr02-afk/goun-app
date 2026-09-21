create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  name text not null,
  price text not null,
  color text not null,
  type text not null,
  locked boolean not null default false,
  created_at timestamptz not null default now()
);

alter table products enable row level security;

create policy "Anyone can view products"
  on products for select
  using (true);

insert into products (brand, name, price, color, type, locked) values
  ('페리페라', '잉크벨벳 #01 코랄', '12,000원', '#D4537E', 'lip', false),
  ('클리오', '러스터 립 틴트', '15,000원', '#E0997B', 'lip', false),
  ('에뛰드', '드로잉 틴트 브라운', '9,900원', '#B54848', 'lip', false),
  ('롬앤', '쥬시 래스팅 틴트', '10,800원', '#C64E6B', 'lip', true),
  ('3CE', '벨벳 립 틴트', '19,000원', '#7A2E3A', 'lip', true),
  ('이니스프리', '노세범 쿠션', '18,000원', '#E8C9A8', 'base', true);
