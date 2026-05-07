
-- Roles
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "admins read roles" on public.user_roles for select using (public.has_role(auth.uid(), 'admin'));

-- Generic updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

-- News posts
create table public.news_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  excerpt text,
  body text,
  cover_image_url text,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.news_posts enable row level security;
create trigger news_updated before update on public.news_posts for each row execute function public.set_updated_at();
create policy "public read published news" on public.news_posts for select using (published = true or public.has_role(auth.uid(),'admin'));
create policy "admins manage news" on public.news_posts for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Hero slides
create table public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text,
  cta_label text,
  cta_href text,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.hero_slides enable row level security;
create trigger hero_updated before update on public.hero_slides for each row execute function public.set_updated_at();
create policy "public read active slides" on public.hero_slides for select using (active = true or public.has_role(auth.uid(),'admin'));
create policy "admins manage slides" on public.hero_slides for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Staff
create table public.staff_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  section text,
  bio text,
  photo_url text,
  email text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.staff_members enable row level security;
create trigger staff_updated before update on public.staff_members for each row execute function public.set_updated_at();
create policy "public read staff" on public.staff_members for select using (true);
create policy "admins manage staff" on public.staff_members for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Documents
create table public.school_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  file_url text not null,
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.school_documents enable row level security;
create trigger docs_updated before update on public.school_documents for each row execute function public.set_updated_at();
create policy "public read docs" on public.school_documents for select using (true);
create policy "admins manage docs" on public.school_documents for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Achievements
create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  event text not null,
  position text,
  description text,
  category text,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.achievements enable row level security;
create trigger ach_updated before update on public.achievements for each row execute function public.set_updated_at();
create policy "public read achievements" on public.achievements for select using (true);
create policy "admins manage achievements" on public.achievements for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Activities (music / sport)
create type public.activity_category as enum ('music','sport');

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  category activity_category not null,
  title text not null,
  description text,
  cover_image_url text,
  youtube_url text,
  event_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.activities enable row level security;
create trigger act_updated before update on public.activities for each row execute function public.set_updated_at();
create policy "public read activities" on public.activities for select using (true);
create policy "admins manage activities" on public.activities for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Gallery photos
create table public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  activity_id uuid references public.activities(id) on delete cascade,
  achievement_id uuid references public.achievements(id) on delete cascade,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.gallery_photos enable row level security;
create policy "public read photos" on public.gallery_photos for select using (true);
create policy "admins manage photos" on public.gallery_photos for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Applications
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  learner_name text not null,
  date_of_birth date,
  id_number text,
  gender text,
  section text not null,
  grade text not null,
  parent_name text not null,
  relationship text,
  phone text not null,
  email text,
  address text,
  notes text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);
alter table public.applications enable row level security;
create policy "anyone can submit application" on public.applications for insert with check (true);
create policy "admins read applications" on public.applications for select using (public.has_role(auth.uid(),'admin'));
create policy "admins update applications" on public.applications for update using (public.has_role(auth.uid(),'admin'));
create policy "admins delete applications" on public.applications for delete using (public.has_role(auth.uid(),'admin'));

-- Storage bucket for media
insert into storage.buckets (id, name, public) values ('media','media', true) on conflict (id) do nothing;
create policy "public read media" on storage.objects for select using (bucket_id = 'media');
create policy "admins upload media" on storage.objects for insert with check (bucket_id = 'media' and public.has_role(auth.uid(),'admin'));
create policy "admins update media" on storage.objects for update using (bucket_id = 'media' and public.has_role(auth.uid(),'admin'));
create policy "admins delete media" on storage.objects for delete using (bucket_id = 'media' and public.has_role(auth.uid(),'admin'));
