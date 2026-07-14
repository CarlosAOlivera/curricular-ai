-- Profiles (auto-created on signup)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  school text,
  role text not null default 'free' check (role in ('free', 'premium', 'institutional')),
  generations_this_month int not null default 0,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Lesson Plans
create table public.lesson_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  grade text not null,
  subject text not null,
  unit text not null,
  week int not null,
  content text not null,
  created_at timestamptz default now()
);

alter table public.lesson_plans enable row level security;
create policy "Users can read own plans" on public.lesson_plans for select using (auth.uid() = user_id);
create policy "Users can insert own plans" on public.lesson_plans for insert with check (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, school)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'school'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
