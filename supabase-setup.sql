-- ============================================================
-- GLOW — SQL para ejecutar en Supabase > SQL Editor
-- Pega todo este bloque y haz clic en "Run"
-- ============================================================

-- 1. Tabla de perfiles
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text,
  username    text unique,
  full_name   text,
  avatar_url  text,
  bio         text,
  platforms   text[] default '{}',   -- ['youtube', 'tiktok', 'instagram']
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- 2. Activar Row Level Security
alter table public.profiles enable row level security;

-- 3. Políticas RLS
create policy "Cada usuaria ve su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Cada usuaria actualiza su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Cada usuaria inserta su propio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 4. Trigger: crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Función para actualizar updated_at automáticamente
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ✅ Listo. Ahora ve a Authentication > Email Templates
--    y personaliza el email de confirmación si quieres.
