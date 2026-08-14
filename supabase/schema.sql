-- =====================================================================
-- StudyPath — Supabase schema (core + RLS). Run once in SQL Editor.
-- Optional seed data is in a clearly marked section at the bottom —
-- delete that section if you don't want sample rows.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------
do $$ begin
  create type user_role as enum ('student', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type degree_level as enum ('diploma', 'bachelor', 'master', 'phd');
exception when duplicate_object then null; end $$;

do $$ begin
  create type funding_type as enum ('full', 'partial');
exception when duplicate_object then null; end $$;

do $$ begin
  create type saved_item_type as enum ('university', 'program', 'scholarship');
exception when duplicate_object then null; end $$;

do $$ begin
  create type application_status as enum ('draft', 'submitted', 'under_review', 'accepted', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type verification_status as enum ('verified', 'pending', 'failed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type job_status as enum ('queued', 'running', 'completed', 'failed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type deadline_type as enum ('application', 'scholarship', 'document');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role user_role not null default 'student',
  education_level text,
  field_of_interest text,
  country_of_origin text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.countries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  region text,
  flag_emoji text,
  image_url text,
  description text,
  currency text,
  avg_tuition_min numeric,
  avg_tuition_max numeric,
  visa_info text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.universities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  country_id uuid not null references public.countries (id) on delete cascade,
  name text not null,
  city text,
  ranking integer,
  description text,
  image_url text,
  website_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists universities_country_id_idx on public.universities (country_id);

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references public.universities (id) on delete cascade,
  name text not null,
  degree_level degree_level not null,
  field_of_study text,
  duration_months integer,
  tuition_amount numeric,
  tuition_currency text default 'EUR',
  language text,
  application_deadline date,
  scholarship_available boolean not null default false,
  description text,
  requirements text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists programs_university_id_idx on public.programs (university_id);
create index if not exists programs_degree_level_idx on public.programs (degree_level);
create index if not exists programs_application_deadline_idx on public.programs (application_deadline);

create table if not exists public.scholarships (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country_id uuid references public.countries (id) on delete set null,
  university_id uuid references public.universities (id) on delete set null,
  program_id uuid references public.programs (id) on delete set null,
  funding_type funding_type not null,
  amount_text text,
  coverage text,
  deadline date,
  eligibility text,
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists scholarships_country_id_idx on public.scholarships (country_id);
create index if not exists scholarships_deadline_idx on public.scholarships (deadline);

create table if not exists public.deadlines (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  deadline_type deadline_type not null,
  deadline_date date not null,
  university_id uuid references public.universities (id) on delete cascade,
  program_id uuid references public.programs (id) on delete cascade,
  scholarship_id uuid references public.scholarships (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists deadlines_deadline_date_idx on public.deadlines (deadline_date);

create table if not exists public.saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  item_type saved_item_type not null,
  item_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);
create index if not exists saved_items_user_id_idx on public.saved_items (user_id);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  program_id uuid not null references public.programs (id) on delete cascade,
  status application_status not null default 'draft',
  notes text,
  applied_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, program_id)
);
create index if not exists applications_user_id_idx on public.applications (user_id);
create index if not exists applications_status_idx on public.applications (status);

create table if not exists public.data_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_url text not null,
  source_type text,
  last_scraped_at timestamptz,
  last_verified_at timestamptz,
  verification_status verification_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.scraping_jobs (
  id uuid primary key default gen_random_uuid(),
  data_source_id uuid not null references public.data_sources (id) on delete cascade,
  job_type text not null,
  status job_status not null default 'queued',
  started_at timestamptz,
  completed_at timestamptz,
  records_found integer not null default 0,
  records_created integer not null default 0,
  records_updated integer not null default 0,
  error_message text,
  created_at timestamptz not null default now()
);
create index if not exists scraping_jobs_data_source_id_idx on public.scraping_jobs (data_source_id);
create index if not exists scraping_jobs_status_idx on public.scraping_jobs (status);

-- ---------------------------------------------------------------------
-- Functions & triggers
-- ---------------------------------------------------------------------

-- Keep updated_at fresh on every UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles', 'countries', 'universities', 'programs', 'scholarships',
    'deadlines', 'applications', 'data_sources'
  ]
  loop
    execute format(
      'drop trigger if exists set_updated_at on public.%I; create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at();',
      t, t
    );
  end loop;
end $$;

-- SECURITY DEFINER helper so RLS policies can check role without recursive
-- RLS evaluation on profiles.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    'student'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Prevent a student from granting themselves the admin role via a
-- profile UPDATE — only an existing admin can change `role`.
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role <> old.role and not public.is_admin() then
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists prevent_role_escalation on public.profiles;
create trigger prevent_role_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_escalation();

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.countries enable row level security;
alter table public.universities enable row level security;
alter table public.programs enable row level security;
alter table public.scholarships enable row level security;
alter table public.deadlines enable row level security;
alter table public.saved_items enable row level security;
alter table public.applications enable row level security;
alter table public.data_sources enable row level security;
alter table public.scraping_jobs enable row level security;

-- profiles: a user can read/update their own row; admins can read all.
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());

-- Public catalog data: readable by anyone (including anonymous visitors
-- browsing before signing up); writable by admins only.
do $$
declare
  t text;
begin
  foreach t in array array['countries', 'universities', 'programs', 'scholarships', 'deadlines']
  loop
    execute format('drop policy if exists "%s_public_read" on public.%I;', t, t);
    execute format(
      'create policy "%s_public_read" on public.%I for select using (true);',
      t, t
    );
    execute format('drop policy if exists "%s_admin_write" on public.%I;', t, t);
    execute format(
      'create policy "%s_admin_write" on public.%I for insert with check (public.is_admin());',
      t, t
    );
    execute format('drop policy if exists "%s_admin_update" on public.%I;', t, t);
    execute format(
      'create policy "%s_admin_update" on public.%I for update using (public.is_admin());',
      t, t
    );
    execute format('drop policy if exists "%s_admin_delete" on public.%I;', t, t);
    execute format(
      'create policy "%s_admin_delete" on public.%I for delete using (public.is_admin());',
      t, t
    );
  end loop;
end $$;

-- saved_items: a student manages only their own saved rows.
drop policy if exists "saved_items_owner_all" on public.saved_items;
create policy "saved_items_owner_all"
  on public.saved_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- applications: a student manages only their own applications;
-- admins can read all (for the admin "Students" view).
drop policy if exists "applications_owner_all" on public.applications;
create policy "applications_owner_all"
  on public.applications for all
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id);

-- data_sources / scraping_jobs: admin-only, not visible to students at all.
do $$
declare
  t text;
begin
  foreach t in array array['data_sources', 'scraping_jobs']
  loop
    execute format('drop policy if exists "%s_admin_all" on public.%I;', t, t);
    execute format(
      'create policy "%s_admin_all" on public.%I for all using (public.is_admin()) with check (public.is_admin());',
      t, t
    );
  end loop;
end $$;

-- =====================================================================
-- OPTIONAL SEED DATA — safe to delete this whole section later.
-- Wrapped so it only inserts rows that don't already exist (by slug).
-- =====================================================================

insert into public.countries (slug, name, region, flag_emoji, image_url, description, currency, avg_tuition_min, avg_tuition_max, visa_info)
values
  ('italy', 'Italy', 'Europe', '🇮🇹',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuASqGRcxgex2QPOpJIIcxtaEXxiTInNxr-dAlyVvMBo5yMB3UDba3V9KjZtZO-kzPGB8d2dVWefaOvPIu-kJYAVJA7X-jfh-DSKfa9r9Adl6z4Tefpj_OO7S2JXhafPD_aVYbVNTsRJs29lffoJ0UlPso8xYPxC8wx08hSal8eCg2So_E9NRB8KVt_ykZJ-FlBhf8MCRGdfHEPlUgXeIJpcuONwQ-jlbwbBG3prVAebfkaT52JQp20LTA',
   'Historic universities, low tuition, and a rich cultural backdrop for international students.', 'EUR', 0, 3000,
   'National (Type D) visa required for non-EU students; apply after receiving an admission letter.'),
  ('germany', 'Germany', 'Europe', '🇩🇪',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuDuB2LcMdps4B7DE1rDK-hsqpZzlfKcByOpdQytYFaDGTfnQmCy14MsyhPvBdJ_J5l7kI5TKK9geURLzvzWQmJNSyBRGK2TPQD2vp_vBX50ZUY5HxuyliaXuO0jO1VylFlPb8gJArzc8UDTj_p7eOX5FDSKSW2RzQm3jUmFwKjG5EcpkrZRsaISWlzvB3n3lfHA7WWnLME2gBoV6ajjvUO-PDad10VxaS0YCEMhlmZ8UwTWyeXVgIOloA',
   'Tuition-free public universities and a strong engineering & research reputation.', 'EUR', 0, 0,
   'National visa required; blocked account (~€11,208) needed to prove financial resources.'),
  ('uk', 'United Kingdom', 'Europe', '🇬🇧',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuADg15JJjsXFdzR4m_t9FY-wsJNT-TPmc4LhCpU6V-DoSSGf-ezB38GUewE22eG4Ij4S7V4roUl6o6DmPDxvWd2kuczsgC2BoE6nIKRViZd59jF8eXlcf0JhNj72xDQJ48JKTeLVFiCRBMvvOFfaL-p8JAdxRNyB_BQImrudFxNWdU0mMBaZXEDkiIVQYzzgVu4t8eoivoFyXMUOLMhcqM1SZSroTExMDbJcOsihbSOP2gf44Cg6etDPQ',
   'World-ranked universities with a wide range of one-year master''s programs.', 'GBP', 12000, 25000,
   'Student visa (Route) required; CAS letter from the university needed to apply.'),
  ('canada', 'Canada', 'North America', '🇨🇦',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuAfTLis-yk5rLbcy-squ3ZPuQ5zMlBmKBqG3JBY8oVfECEIX8KBgjPhrJjvvqSB0kRaVdO0yhijr8Fwb53Gq1HHGDMJzEcmuqaP508WWsSzPlLc5nX44mbuh-dyRLy0Sz8ssSGRAtuNEzPz37O_XYdJbsYRTWuJUCxVVezlDOglI5QJJ4SU5o4ZAOQHC1ArejlaFSuhPK-vqXIyRUkIc0NwQY5nXsbN6FTh_IkGwN77-6LC7-xawItmBQ',
   'Welcoming immigration pathways and a post-study work visa for graduates.', 'CAD', 15000, 30000,
   'Study permit required; Post-Graduation Work Permit available after completion.')
on conflict (slug) do nothing;

insert into public.universities (slug, country_id, name, city, ranking, description, image_url, website_url)
select v.slug, c.id, v.name, v.city, v.ranking, v.description, v.image_url, v.website_url
from (values
  ('politecnico-di-milano', 'italy', 'Politecnico di Milano', 'Milan', 1,
   'Italy''s largest technical university, renowned for architecture, design, and engineering.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuASqGRcxgex2QPOpJIIcxtaEXxiTInNxr-dAlyVvMBo5yMB3UDba3V9KjZtZO-kzPGB8d2dVWefaOvPIu-kJYAVJA7X-jfh-DSKfa9r9Adl6z4Tefpj_OO7S2JXhafPD_aVYbVNTsRJs29lffoJ0UlPso8xYPxC8wx08hSal8eCg2So_E9NRB8KVt_ykZJ-FlBhf8MCRGdfHEPlUgXeIJpcuONwQ-jlbwbBG3prVAebfkaT52JQp20LTA',
   'https://www.polimi.it'),
  ('sapienza-university', 'italy', 'Sapienza University of Rome', 'Rome', 2,
   'One of the oldest universities in the world, offering a broad range of disciplines.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuASqGRcxgex2QPOpJIIcxtaEXxiTInNxr-dAlyVvMBo5yMB3UDba3V9KjZtZO-kzPGB8d2dVWefaOvPIu-kJYAVJA7X-jfh-DSKfa9r9Adl6z4Tefpj_OO7S2JXhafPD_aVYbVNTsRJs29lffoJ0UlPso8xYPxC8wx08hSal8eCg2So_E9NRB8KVt_ykZJ-FlBhf8MCRGdfHEPlUgXeIJpcuONwQ-jlbwbBG3prVAebfkaT52JQp20LTA',
   'https://www.uniroma1.it'),
  ('tu-munich', 'germany', 'Technical University of Munich', 'Munich', 1,
   'A leading European technical university with strong industry ties.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuDuB2LcMdps4B7DE1rDK-hsqpZzlfKcByOpdQytYFaDGTfnQmCy14MsyhPvBdJ_J5l7kI5TKK9geURLzvzWQmJNSyBRGK2TPQD2vp_vBX50ZUY5HxuyliaXuO0jO1VylFlPb8gJArzc8UDTj_p7eOX5FDSKSW2RzQm3jUmFwKjG5EcpkrZRsaISWlzvB3n3lfHA7WWnLME2gBoV6ajjvUO-PDad10VxaS0YCEMhlmZ8UwTWyeXVgIOloA',
   'https://www.tum.de'),
  ('oxford', 'uk', 'University of Oxford', 'Oxford', 1,
   'The oldest university in the English-speaking world.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuADg15JJjsXFdzR4m_t9FY-wsJNT-TPmc4LhCpU6V-DoSSGf-ezB38GUewE22eG4Ij4S7V4roUl6o6DmPDxvWd2kuczsgC2BoE6nIKRViZd59jF8eXlcf0JhNj72xDQJ48JKTeLVFiCRBMvvOFfaL-p8JAdxRNyB_BQImrudFxNWdU0mMBaZXEDkiIVQYzzgVu4t8eoivoFyXMUOLMhcqM1SZSroTExMDbJcOsihbSOP2gf44Cg6etDPQ',
   'https://www.ox.ac.uk'),
  ('ubc', 'canada', 'University of British Columbia', 'Vancouver', 1,
   'A top-ranked Canadian research university on the Pacific coast.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuAfTLis-yk5rLbcy-squ3ZPuQ5zMlBmKBqG3JBY8oVfECEIX8KBgjPhrJjvvqSB0kRaVdO0yhijr8Fwb53Gq1HHGDMJzEcmuqaP508WWsSzPlLc5nX44mbuh-dyRLy0Sz8ssSGRAtuNEzPz37O_XYdJbsYRTWuJUCxVVezlDOglI5QJJ4SU5o4ZAOQHC1ArejlaFSuhPK-vqXIyRUkIc0NwQY5nXsbN6FTh_IkGwN77-6LC7-xawItmBQ',
   'https://www.ubc.ca')
) as v(slug, country_slug, name, city, ranking, description, image_url, website_url)
join public.countries c on c.slug = v.country_slug
on conflict (slug) do nothing;

insert into public.programs (university_id, name, degree_level, field_of_study, duration_months, tuition_amount, tuition_currency, language, application_deadline, scholarship_available, description, requirements)
select u.id, v.name, v.degree_level::degree_level, v.field_of_study, v.duration_months, v.tuition_amount, v.tuition_currency, v.language, v.application_deadline::date, v.scholarship_available, v.description, v.requirements
from (values
  ('politecnico-di-milano', 'MSc Computer Science', 'master', 'Computer Science', 24, 3900, 'EUR', 'English', '2024-05-15', true,
   'A research-focused program covering AI, distributed systems, and software engineering.',
   'Bachelor''s degree in CS or related field; IELTS 6.5+; strong programming background.'),
  ('politecnico-di-milano', 'BSc Architecture', 'bachelor', 'Architecture', 36, 3900, 'EUR', 'Italian', '2024-08-01', false,
   'A studio-based undergraduate program in architectural design.',
   'High school diploma; portfolio submission; Italian language proficiency B2.'),
  ('sapienza-university', 'MSc Artificial Intelligence', 'master', 'Artificial Intelligence', 24, 2500, 'EUR', 'English', '2024-06-30', true,
   'Advanced coursework in machine learning, robotics, and NLP.',
   'Bachelor''s in a quantitative field; IELTS 6.0+.'),
  ('tu-munich', 'MSc Data Engineering', 'master', 'Data Science', 24, 0, 'EUR', 'English', '2024-05-31', true,
   'A tuition-free program focused on large-scale data systems.',
   'Bachelor''s in CS/Engineering; GRE recommended; IELTS 6.5+.'),
  ('oxford', 'MSc Computer Science', 'master', 'Computer Science', 12, 39000, 'GBP', 'English', '2024-01-10', false,
   'An intensive one-year master''s with a strong theoretical foundation.',
   'First-class undergraduate degree; IELTS 7.0+; references required.'),
  ('ubc', 'MBA', 'master', 'Business Administration', 20, 58000, 'CAD', 'English', '2024-04-01', true,
   'A globally-ranked MBA with a focus on sustainable business.',
   '2+ years work experience; GMAT/GRE; IELTS 7.0+.')
) as v(university_slug, name, degree_level, field_of_study, duration_months, tuition_amount, tuition_currency, language, application_deadline, scholarship_available, description, requirements)
join public.universities u on u.slug = v.university_slug;

insert into public.scholarships (name, country_id, university_id, funding_type, amount_text, coverage, deadline, eligibility, source_url)
select v.name, c.id, u.id, v.funding_type::funding_type, v.amount_text, v.coverage, v.deadline::date, v.eligibility, v.source_url
from (values
  ('DAAD Scholarship', 'germany', 'tu-munich', 'full', '€934 - €1,200/mo', 'Tuition, Travel, Health Insurance', '2024-12-15',
   'International master''s/PhD students in Germany with strong academic records.', 'https://www.daad.de'),
  ('Eiffel Excellence Program', 'italy', null, 'partial', '€1,181 - €1,700/mo', 'Living allowance, Travel, Housing aid', '2025-01-10',
   'Master''s/PhD students under 25/30 years old applying to partner institutions.', 'https://www.france-visas.gouv.fr')
) as v(name, country_slug, university_slug, funding_type, amount_text, coverage, deadline, eligibility, source_url)
join public.countries c on c.slug = v.country_slug
left join public.universities u on u.slug = v.university_slug;

insert into public.deadlines (title, deadline_type, deadline_date, university_id, program_id)
select v.title, v.deadline_type::deadline_type, v.deadline_date::date, u.id, p.id
from (values
  ('Oxford Winter Intake', 'application', '2024-01-10', 'oxford', 'MSc Computer Science'),
  ('Politecnico di Milano — MSc CS', 'application', '2024-05-15', 'politecnico-di-milano', 'MSc Computer Science'),
  ('UBC MBA Early Admission', 'application', '2024-04-01', 'ubc', 'MBA')
) as v(title, deadline_type, deadline_date, university_slug, program_name)
join public.universities u on u.slug = v.university_slug
left join public.programs p on p.university_id = u.id and p.name = v.program_name;

insert into public.data_sources (name, source_url, source_type, verification_status)
values
  ('DAAD Scholarship Portal', 'https://www.daad.de/en/', 'scholarship_feed', 'verified'),
  ('Uni-Assist Deadlines', 'https://www.uni-assist.de/en/', 'deadline_feed', 'pending')
on conflict do nothing;
