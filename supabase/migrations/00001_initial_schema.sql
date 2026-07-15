-- Poupensa — schema inicial
-- Modelo de dados conforme PRD.md ("Modelo de Dados") e TODOS.md Fase 2.
-- Todas as tabelas pertencem (direta ou indiretamente) a um household;
-- o isolamento entre casais é feito por RLS (ver 00002_rls_policies.sql).

create extension if not exists pgcrypto;

-- Unidade familiar (casal). O convite é feito por invite_code curto.
create table households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text not null unique
    default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6)),
  created_at timestamptz not null default now()
);

-- Relação usuário <-> household. O MVP limita a 2 membros por household
-- (regra aplicada na função join_household_by_code, não por constraint,
-- para manter a mensagem de erro amigável).
create table household_members (
  household_id uuid not null references households (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

create index household_members_user_id_idx on household_members (user_id);

-- Item da despensa. Quantidades vivem nos registros (compra/conferência),
-- não no item — o item é só o cadastro (nome + unidade).
create table items (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households (id) on delete cascade,
  name text not null,
  unit text not null, -- ex.: kg, g, L, ml, un, pacote
  created_at timestamptz not null default now(),
  unique (household_id, name)
);

create index items_household_id_idx on items (household_id);

-- Registro de compra: quanto foi comprado de um item em uma data.
create table purchase_records (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items (id) on delete cascade,
  quantity numeric not null check (quantity >= 0),
  purchased_at date not null default current_date,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index purchase_records_item_id_idx on purchase_records (item_id, purchased_at desc);

-- Conferência pré-compra: quanto restou de um item em uma data.
create table check_records (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items (id) on delete cascade,
  quantity_left numeric not null check (quantity_left >= 0),
  checked_at date not null default current_date,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index check_records_item_id_idx on check_records (item_id, checked_at desc);

-- Registro opcional de "acabou": item esgotou no meio do ciclo.
create table depleted_records (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items (id) on delete cascade,
  depleted_at date not null default current_date,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index depleted_records_item_id_idx on depleted_records (item_id, depleted_at desc);
