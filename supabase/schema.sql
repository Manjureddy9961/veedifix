-- RESET (safe to re-run): removes the old VeediFix tables, then rebuilds everything below.
drop trigger if exists on_auth_user_created on auth.users;
drop table if exists upvotes, issues, categories, profiles cascade;
drop function if exists handle_new_user(), is_authority(), my_role(), upvote(uuid);
drop policy if exists "upload photos" on storage.objects;
drop policy if exists "view photos" on storage.objects;
 
-- VeediFix schema. Supabase > SQL Editor > New query > paste > Run.
create table profiles(id uuid primary key references auth.users on delete cascade, name text, email text, role text not null default 'citizen' check (role in ('citizen','authority','admin')), created_at timestamptz default now());
create table categories(id serial primary key, name text unique not null, icon text default '📌');
create table issues(id uuid primary key default gen_random_uuid(), user_id uuid not null references profiles(id) on delete cascade default auth.uid(),
 title text not null, description text, category_id int references categories(id) on delete set null, photo_url text, lat double precision, lng double precision, address text,
 status text not null default 'new' check (status in ('new','assigned','progress','fixed')), upvotes int not null default 0, created_at timestamptz not null default now());
create table upvotes(user_id uuid references profiles(id) on delete cascade default auth.uid(), issue_id uuid references issues on delete cascade, primary key(user_id,issue_id));
 
create function my_role() returns text language sql security definer set search_path=public stable as $$ select role from profiles where id=auth.uid() $$;
create function handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$ begin
 insert into profiles(id,name,email) values(new.id, coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)), new.email); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();
create function upvote(p_issue uuid) returns void language plpgsql security definer set search_path=public as $$ begin
 insert into upvotes(user_id,issue_id) values(auth.uid(),p_issue) on conflict do nothing;
 if found then update issues set upvotes=upvotes+1 where id=p_issue; end if; end $$;
 
alter table profiles enable row level security; alter table categories enable row level security; alter table issues enable row level security; alter table upvotes enable row level security;
create policy "read own profile or admin" on profiles for select using (id=auth.uid() or my_role()='admin');
create policy "admin changes roles" on profiles for update using (my_role()='admin') with check (my_role()='admin');
create policy "read categories" on categories for select using (true);
create policy "admin adds categories" on categories for insert with check (my_role()='admin');
create policy "admin deletes categories" on categories for delete using (my_role()='admin');
create policy "read issues" on issues for select using (true);
create policy "signed-in users report" on issues for insert with check (user_id=auth.uid());
create policy "authority/admin update" on issues for update using (my_role() in ('authority','admin'));
create policy "admin deletes issues" on issues for delete using (my_role()='admin');
create policy "own upvotes" on upvotes for select using (user_id=auth.uid());
 
insert into categories(name,icon) values ('Pothole','🕳️'),('Water leak','💧'),('Street light','💡'),('Garbage','🗑️'),('Drainage','🌊'),('Other','📌');
 
-- Create profiles for users who already signed up
insert into profiles(id,name,email) select id, split_part(email,'@',1), email from auth.users on conflict do nothing;
 
-- Photo storage
insert into storage.buckets(id,name,public) values ('issue-photos','issue-photos',true) on conflict (id) do nothing;
create policy "upload photos" on storage.objects for insert to authenticated with check (bucket_id='issue-photos');
create policy "view photos" on storage.objects for select using (bucket_id='issue-photos');
 
-- FIRST ADMIN: sign up once on the User page, then run this with your email:
-- update profiles set role='admin' where email='you@example.com';
-- After that, make officers from the Admin panel > Users (change role to Authority).