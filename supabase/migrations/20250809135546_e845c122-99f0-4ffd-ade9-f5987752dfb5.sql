
-- Extensões necessárias
create extension if not exists pgcrypto;
create extension if not exists unaccent;

-- Enums
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'empresa', 'user');
  end if;

  if not exists (select 1 from pg_type where typname = 'company_status') then
    create type public.company_status as enum ('pending', 'approved', 'rejected');
  end if;

  if not exists (select 1 from pg_type where typname = 'ad_status') then
    create type public.ad_status as enum ('draft', 'published', 'unlisted');
  end if;

  if not exists (select 1 from pg_type where typname = 'news_status') then
    create type public.news_status as enum ('draft', 'published');
  end if;

  if not exists (select 1 from pg_type where typname = 'job_type') then
    create type public.job_type as enum ('full_time','part_time','contract','temporary','internship','remote');
  end if;

  if not exists (select 1 from pg_type where typname = 'job_status') then
    create type public.job_status as enum ('draft','published','closed');
  end if;

  if not exists (select 1 from pg_type where typname = 'subscription_status') then
    create type public.subscription_status as enum ('trialing','active','past_due','canceled','incomplete','incomplete_expired','paused');
  end if;

  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type public.payment_status as enum ('pending','succeeded','failed','refunded');
  end if;
end$$;

-- Função utilitária: slugify
create or replace function public.slugify(input text)
returns text
language sql
immutable
as $$
  select trim(both '-' from lower(regexp_replace(unaccent(input), '[^a-zA-Z0-9]+', '-', 'g')));
$$;

-- Função utilitária: atualizar updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- PERFIS (espelho de auth.users para uso via API)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text, -- mantemos aqui para acesso fácil (opcionalmente sincronizado)
  first_name text,
  last_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- Trigger updated_at
drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Trigger para criar profile ao registar utilizador
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'first_name', null),
    coalesce(new.raw_user_meta_data ->> 'last_name', null),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Políticas para profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id or public.has_role(auth.uid(), 'admin'));

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id or public.has_role(auth.uid(), 'admin'));

-- PAPÉIS (roles)
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

-- Função para verificar papel
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

-- Políticas para user_roles
drop policy if exists "user_roles_select_self_or_admin" on public.user_roles;
create policy "user_roles_select_self_or_admin"
on public.user_roles
for select
using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

drop policy if exists "user_roles_admin_manage" on public.user_roles;
create policy "user_roles_admin_manage"
on public.user_roles
for all
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- EMPRESAS
create table if not exists public.empresas (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  nome text not null,
  slug text not null unique,
  descricao text,
  telefone text,
  site_url text,
  morada text,
  nif text,
  logo_url text,
  status public.company_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.empresas enable row level security;

-- Trigger updated_at
drop trigger if exists trg_empresas_updated_at on public.empresas;
create trigger trg_empresas_updated_at
before update on public.empresas
for each row execute function public.set_updated_at();

-- Trigger slug automático
create or replace function public.empresas_set_slug()
returns trigger
language plpgsql
as $$
begin
  if new.slug is null or length(new.slug) = 0 then
    new.slug := public.slugify(new.nome);
  else
    new.slug := public.slugify(new.slug);
  end if;
  return new;
end;
$$;
drop trigger if exists trg_empresas_set_slug on public.empresas;
create trigger trg_empresas_set_slug
before insert or update on public.empresas
for each row execute procedure public.empresas_set_slug();

-- Políticas empresas
drop policy if exists "empresas_public_view_approved" on public.empresas;
create policy "empresas_public_view_approved"
on public.empresas
for select
to public
using (status = 'approved' or public.has_role(auth.uid(), 'admin') or owner_id = auth.uid());

drop policy if exists "empresas_owner_crud" on public.empresas;
create policy "empresas_owner_crud"
on public.empresas
for all
to authenticated
using (owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'))
with check (owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

-- ANÚNCIOS
create table if not exists public.anuncios (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  titulo text not null,
  descricao text,
  preco numeric(10,2),
  categoria text,
  imagens_urls text[],
  status public.ad_status not null default 'draft',
  visualizacoes integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.anuncios enable row level security;

drop trigger if exists trg_anuncios_updated_at on public.anuncios;
create trigger trg_anuncios_updated_at
before update on public.anuncios
for each row execute function public.set_updated_at();

-- Políticas anúncios (publica só 'published', donos e admin tudo)
drop policy if exists "anuncios_public_view_published" on public.anuncios;
create policy "anuncios_public_view_published"
on public.anuncios
for select
to public
using (
  status = 'published'
  or public.has_role(auth.uid(),'admin')
  or exists (
    select 1 from public.empresas e
    where e.id = anuncios.empresa_id and e.owner_id = auth.uid()
  )
);

drop policy if exists "anuncios_owner_crud" on public.anuncios;
create policy "anuncios_owner_crud"
on public.anuncios
for all
to authenticated
using (
  public.has_role(auth.uid(),'admin')
  or exists (
    select 1 from public.empresas e
    where e.id = anuncios.empresa_id and e.owner_id = auth.uid()
  )
)
with check (
  public.has_role(auth.uid(),'admin')
  or exists (
    select 1 from public.empresas e
    where e.id = anuncios.empresa_id and e.owner_id = auth.uid()
  )
);

-- NOTÍCIAS
create table if not exists public.noticias (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles(id) on delete set null,
  titulo text not null,
  slug text not null unique,
  conteudo text,
  categoria text,
  capa_url text,
  status public.news_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.noticias enable row level security;

drop trigger if exists trg_noticias_updated_at on public.noticias;
create trigger trg_noticias_updated_at
before update on public.noticias
for each row execute function public.set_updated_at();

create or replace function public.noticias_set_slug()
returns trigger
language plpgsql
as $$
begin
  if new.slug is null or length(new.slug) = 0 then
    new.slug := public.slugify(new.titulo);
  else
    new.slug := public.slugify(new.slug);
  end if;
  return new;
end;
$$;
drop trigger if exists trg_noticias_set_slug on public.noticias;
create trigger trg_noticias_set_slug
before insert or update on public.noticias
for each row execute procedure public.noticias_set_slug();

-- Políticas notícias
drop policy if exists "noticias_public_view_published" on public.noticias;
create policy "noticias_public_view_published"
on public.noticias
for select
to public
using (status = 'published' or public.has_role(auth.uid(),'admin'));

drop policy if exists "noticias_admin_manage" on public.noticias;
create policy "noticias_admin_manage"
on public.noticias
for all
to authenticated
using (public.has_role(auth.uid(),'admin') and admin_id = auth.uid())
with check (public.has_role(auth.uid(),'admin') and admin_id = auth.uid());

-- VAGAS
create table if not exists public.vagas (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  titulo text not null,
  descricao text,
  localizacao text,
  tipo public.job_type not null default 'full_time',
  status public.job_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.vagas enable row level security;

drop trigger if exists trg_vagas_updated_at on public.vagas;
create trigger trg_vagas_updated_at
before update on public.vagas
for each row execute function public.set_updated_at();

-- Políticas vagas
drop policy if exists "vagas_public_view_published" on public.vagas;
create policy "vagas_public_view_published"
on public.vagas
for select
to public
using (
  status = 'published'
  or public.has_role(auth.uid(),'admin')
  or exists (select 1 from public.empresas e where e.id = vagas.empresa_id and e.owner_id = auth.uid())
);

drop policy if exists "vagas_owner_crud" on public.vagas;
create policy "vagas_owner_crud"
on public.vagas
for all
to authenticated
using (
  public.has_role(auth.uid(),'admin')
  or exists (select 1 from public.empresas e where e.id = vagas.empresa_id and e.owner_id = auth.uid())
)
with check (
  public.has_role(auth.uid(),'admin')
  or exists (select 1 from public.empresas e where e.id = vagas.empresa_id and e.owner_id = auth.uid())
);

-- CANDIDATURAS
create table if not exists public.candidaturas (
  id uuid primary key default gen_random_uuid(),
  vaga_id uuid not null references public.vagas(id) on delete cascade,
  applicant_profile_id uuid references public.profiles(id) on delete set null,
  nome text,
  email text,
  cv_url text,
  mensagem text,
  enviado_em timestamptz not null default now()
);
alter table public.candidaturas enable row level security;

-- Políticas candidaturas
-- Inserção por qualquer visitante (para permitir candidaturas públicas)
drop policy if exists "candidaturas_public_insert" on public.candidaturas;
create policy "candidaturas_public_insert"
on public.candidaturas
for insert
to public
with check (true);

-- Leitura: admin, dono da vaga (empresa) e o próprio candidato autenticado
drop policy if exists "candidaturas_select_rules" on public.candidaturas;
create policy "candidaturas_select_rules"
on public.candidaturas
for select
to public
using (
  public.has_role(auth.uid(),'admin')
  or (applicant_profile_id is not null and applicant_profile_id = auth.uid())
  or exists (
    select 1
    from public.vagas v
    join public.empresas e on e.id = v.empresa_id
    where v.id = candidaturas.vaga_id and e.owner_id = auth.uid()
  )
);

-- SUBSCRIÇÕES
create table if not exists public.assinaturas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_subscription_id text unique,
  plano text,
  status public.subscription_status not null default 'trialing',
  trial_ate timestamptz,
  renovacao_em timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.assinaturas enable row level security;

drop trigger if exists trg_assinaturas_updated_at on public.assinaturas;
create trigger trg_assinaturas_updated_at
before update on public.assinaturas
for each row execute function public.set_updated_at();

-- Validação de datas via trigger (evitar CHECKs com now())
create or replace function public.assinaturas_validate_dates()
returns trigger
language plpgsql
as $$
begin
  if new.trial_ate is not null and new.trial_ate < now() then
    raise exception 'trial_ate não pode ser no passado';
  end if;
  return new;
end;
$$;
drop trigger if exists trg_assinaturas_validate on public.assinaturas;
create trigger trg_assinaturas_validate
before insert or update on public.assinaturas
for each row execute procedure public.assinaturas_validate_dates();

-- Políticas assinaturas
drop policy if exists "assinaturas_user_crud" on public.assinaturas;
create policy "assinaturas_user_crud"
on public.assinaturas
for all
to authenticated
using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'))
with check (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

-- PAGAMENTOS DE SERVIÇO
create table if not exists public.pagamentos_servico (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  empresa_id uuid references public.empresas(id) on delete set null,
  amount numeric(10,2) not null,
  currency text not null default 'EUR',
  status public.payment_status not null default 'pending',
  stripe_payment_intent_id text,
  description text,
  created_at timestamptz not null default now()
);
alter table public.pagamentos_servico enable row level security;

-- Políticas pagamentos
drop policy if exists "pagamentos_select_own_or_admin" on public.pagamentos_servico;
create policy "pagamentos_select_own_or_admin"
on public.pagamentos_servico
for select
to authenticated
using (
  public.has_role(auth.uid(),'admin')
  or user_id = auth.uid()
  or exists (select 1 from public.empresas e where e.id = pagamentos_servico.empresa_id and e.owner_id = auth.uid())
);

drop policy if exists "pagamentos_admin_manage" on public.pagamentos_servico;
create policy "pagamentos_admin_manage"
on public.pagamentos_servico
for all
to authenticated
using (public.has_role(auth.uid(),'admin'))
with check (public.has_role(auth.uid(),'admin'));

-- VISITAS (analytics simples)
create table if not exists public.visitas (
  id bigserial primary key,
  ip inet,
  pagina text not null,
  criado_em timestamptz not null default now()
);
alter table public.visitas enable row level security;

-- Permitir INSERT público (para registar visitas anónimas)
drop policy if exists "visitas_public_insert" on public.visitas;
create policy "visitas_public_insert"
on public.visitas
for insert
to public
with check (true);

-- Apenas admin pode consultar
drop policy if exists "visitas_admin_select" on public.visitas;
create policy "visitas_admin_select"
on public.visitas
for select
to authenticated
using (public.has_role(auth.uid(),'admin'));

-- MENSAGENS (caixa de mensagens)
create table if not exists public.mensagens (
  id uuid primary key default gen_random_uuid(),
  sender_profile_id uuid not null references public.profiles(id) on delete cascade,
  recipient_profile_id uuid not null references public.profiles(id) on delete cascade,
  subject text,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.mensagens enable row level security;

drop policy if exists "mensagens_access" on public.mensagens;
create policy "mensagens_access"
on public.mensagens
for select
to authenticated
using (
  public.has_role(auth.uid(),'admin')
  or sender_profile_id = auth.uid()
  or recipient_profile_id = auth.uid()
);

drop policy if exists "mensagens_insert_sender_only" on public.mensagens;
create policy "mensagens_insert_sender_only"
on public.mensagens
for insert
to authenticated
with check (sender_profile_id = auth.uid() or public.has_role(auth.uid(),'admin'));

drop policy if exists "mensagens_update_read" on public.mensagens;
create policy "mensagens_update_read"
on public.mensagens
for update
to authenticated
using (
  public.has_role(auth.uid(),'admin')
  or recipient_profile_id = auth.uid()
)
with check (true);

-- CONTACTOS (formulário público)
create table if not exists public.contactos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null,
  mensagem text not null,
  processado boolean not null default false,
  criado_em timestamptz not null default now()
);
alter table public.contactos enable row level security;

drop policy if exists "contactos_public_insert" on public.contactos;
create policy "contactos_public_insert"
on public.contactos
for insert
to public
with check (true);

drop policy if exists "contactos_admin_manage" on public.contactos;
create policy "contactos_admin_manage"
on public.contactos
for select using (public.has_role(auth.uid(),'admin'))
with check (public.has_role(auth.uid(),'admin'));

-- EMAIL (definições e logs)
create table if not exists public.email_settings (
  id uuid primary key default gen_random_uuid(),
  host text,
  port integer,
  username text,
  use_tls boolean default true,
  from_address text,
  updated_at timestamptz not null default now()
);
alter table public.email_settings enable row level security;

drop trigger if exists trg_email_settings_updated_at on public.email_settings;
create trigger trg_email_settings_updated_at
before update on public.email_settings
for each row execute function public.set_updated_at();

drop policy if exists "email_settings_admin_only" on public.email_settings;
create policy "email_settings_admin_only"
on public.email_settings
for all
to authenticated
using (public.has_role(auth.uid(),'admin'))
with check (public.has_role(auth.uid(),'admin'));

create table if not exists public.email_logs (
  id uuid primary key default gen_random_uuid(),
  to_address text not null,
  subject text,
  status text not null, -- ex: sent, failed
  error text,
  created_at timestamptz not null default now()
);
alter table public.email_logs enable row level security;

drop policy if exists "email_logs_admin_only" on public.email_logs;
create policy "email_logs_admin_only"
on public.email_logs
for select using (public.has_role(auth.uid(),'admin'))
with check (public.has_role(auth.uid(),'admin'));

-- CONFIGURAÇÕES PÚBLICAS (lidas por todos)
create table if not exists public.public_configs (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.public_configs enable row level security;

drop trigger if exists trg_public_configs_updated_at on public.public_configs;
create trigger trg_public_configs_updated_at
before update on public.public_configs
for each row execute function public.set_updated_at();

drop policy if exists "public_configs_read_all" on public.public_configs;
create policy "public_configs_read_all"
on public.public_configs
for select
to public
using (true);

drop policy if exists "public_configs_admin_write" on public.public_configs;
create policy "public_configs_admin_write"
on public.public_configs
for all
to authenticated
using (public.has_role(auth.uid(),'admin'))
with check (public.has_role(auth.uid(),'admin'));

-- HISTÓRICO (audit trail)
create table if not exists public.historico (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references public.profiles(id) on delete set null,
  entity_table text not null,
  entity_id uuid,
  action text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);
alter table public.historico enable row level security;

drop policy if exists "historico_admin_all_actor_view" on public.historico;
create policy "historico_admin_all_actor_view"
on public.historico
for select
to authenticated
using (public.has_role(auth.uid(),'admin') or actor_profile_id = auth.uid());

drop policy if exists "historico_admin_insert" on public.historico;
create policy "historico_admin_insert"
on public.historico
for insert
to authenticated
with check (public.has_role(auth.uid(),'admin'));

-- FUNCIONÁRIOS (ligados à empresa)
create table if not exists public.funcionarios (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  cargo text,
  iniciado_em date,
  terminado_em date,
  created_at timestamptz not null default now()
);
alter table public.funcionarios enable row level security;

drop policy if exists "funcionarios_owner_or_admin" on public.funcionarios;
create policy "funcionarios_owner_or_admin"
on public.funcionarios
for all
to authenticated
using (
  public.has_role(auth.uid(),'admin')
  or exists (select 1 from public.empresas e where e.id = funcionarios.empresa_id and e.owner_id = auth.uid())
)
with check (
  public.has_role(auth.uid(),'admin')
  or exists (select 1 from public.empresas e where e.id = funcionarios.empresa_id and e.owner_id = auth.uid())
);

-- Índices úteis
create index if not exists idx_empresas_owner on public.empresas(owner_id);
create index if not exists idx_anuncios_empresa on public.anuncios(empresa_id);
create index if not exists idx_vagas_empresa on public.vagas(empresa_id);
create index if not exists idx_candidaturas_vaga on public.candidaturas(vaga_id);
create index if not exists idx_pagamentos_user on public.pagamentos_servico(user_id);
create index if not exists idx_pagamentos_empresa on public.pagamentos_servico(empresa_id);
create index if not exists idx_mensagens_partes on public.mensagens(sender_profile_id, recipient_profile_id);
create index if not exists idx_noticias_status on public.noticias(status);
create index if not exists idx_anuncios_status on public.anuncios(status);
create index if not exists idx_vagas_status on public.vagas(status);

-- Realtime (ativar para tabelas principais)
alter table public.noticias replica identity full;
alter table public.anuncios replica identity full;
alter table public.vagas replica identity full;
alter table public.candidaturas replica identity full;

-- Adicionar à publicação supabase_realtime
do $$
begin
  begin
    alter publication supabase_realtime add table public.noticias;
  exception when others then null;
  end;
  begin
    alter publication supabase_realtime add table public.anuncios;
  exception when others then null;
  end;
  begin
    alter publication supabase_realtime add table public.vagas;
  exception when others then null;
  end;
  begin
    alter publication supabase_realtime add table public.candidaturas;
  exception when others then null;
  end;
end$$;

-- Dicas pós-migração:
-- 1) Para tornar um utilizador ADMIN depois de se registar e iniciar sessão,
--    insira na tabela user_roles com o id do utilizador:
--    insert into public.user_roles (user_id, role) values ('<UUID_DO_USER>', 'admin');
--
-- 2) Para empresas, lembre-se de aprovar (status='approved') para aparecerem publicamente.
