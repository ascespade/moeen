-- Translations table
create table if not exists public.translations (
  id bigserial primary key,
  locale text not null check (locale in ('ar','en')),
  namespace text not null default 'common',
  key text not null,
  value text not null,
  unique(locale, namespace, key)
);

-- RLS: allow read to anon, write only to service role
alter table public.translations enable row level security;

create policy "Allow read to anon" on public.translations
  for select using (true);

-- Upserts via service role only
create policy "Service write" on public.translations
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- Seed basic keys
insert into public.translations(locale, namespace, key, value) values
('ar','common','app.name','معين'),
('ar','common','nav.dashboard','لوحة التحكم'),
('ar','common','nav.conversations','المحادثات'),
('en','common','app.name','Mu\'ayin'),
('en','common','nav.dashboard','Dashboard'),
('en','common','nav.conversations','Conversations')
on conflict (locale, namespace, key) do nothing;

