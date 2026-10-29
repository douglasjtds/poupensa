-- Poupensa — Row Level Security
-- Regra central: um usuário só lê/escreve dados de households dos quais é
-- membro (via household_members). Criação de household e entrada por convite
-- acontecem exclusivamente pelas funções RPC no fim deste arquivo (security
-- definer), então NÃO existem policies de INSERT para households nem
-- household_members — insert direto por client é negado por padrão.

-- Função helper usada pelas policies. SECURITY DEFINER evita recursão de RLS
-- ao consultar household_members dentro de uma policy da própria tabela.
create or replace function is_household_member(hid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from household_members
    where household_id = hid and user_id = auth.uid()
  );
$$;

alter table households enable row level security;
alter table household_members enable row level security;
alter table items enable row level security;
alter table purchase_records enable row level security;
alter table check_records enable row level security;
alter table depleted_records enable row level security;

-- households: membro pode ler e renomear; ninguém deleta pelo client no MVP.
create policy "households_select_member" on households
  for select using (is_household_member(id));

create policy "households_update_member" on households
  for update using (is_household_member(id)) with check (is_household_member(id));

-- household_members: membro enxerga a lista de membros do próprio household.
-- Sem insert/update/delete via client (só RPC).
create policy "household_members_select_member" on household_members
  for select using (is_household_member(household_id));

-- items: CRUD completo para membros do household do item.
create policy "items_select_member" on items
  for select using (is_household_member(household_id));
create policy "items_insert_member" on items
  for insert with check (is_household_member(household_id));
create policy "items_update_member" on items
  for update using (is_household_member(household_id))
  with check (is_household_member(household_id));
create policy "items_delete_member" on items
  for delete using (is_household_member(household_id));

-- Registros (compra/conferência/acabou): acesso via household do item pai.
-- created_by é sempre o próprio usuário no insert.

create policy "purchase_records_select_member" on purchase_records
  for select using (
    exists (select 1 from items i where i.id = item_id and is_household_member(i.household_id))
  );
create policy "purchase_records_insert_member" on purchase_records
  for insert with check (
    created_by = auth.uid()
    and exists (select 1 from items i where i.id = item_id and is_household_member(i.household_id))
  );
create policy "purchase_records_update_member" on purchase_records
  for update using (
    exists (select 1 from items i where i.id = item_id and is_household_member(i.household_id))
  );
create policy "purchase_records_delete_member" on purchase_records
  for delete using (
    exists (select 1 from items i where i.id = item_id and is_household_member(i.household_id))
  );

create policy "check_records_select_member" on check_records
  for select using (
    exists (select 1 from items i where i.id = item_id and is_household_member(i.household_id))
  );
create policy "check_records_insert_member" on check_records
  for insert with check (
    created_by = auth.uid()
    and exists (select 1 from items i where i.id = item_id and is_household_member(i.household_id))
  );
create policy "check_records_update_member" on check_records
  for update using (
    exists (select 1 from items i where i.id = item_id and is_household_member(i.household_id))
  );
create policy "check_records_delete_member" on check_records
  for delete using (
    exists (select 1 from items i where i.id = item_id and is_household_member(i.household_id))
  );

create policy "depleted_records_select_member" on depleted_records
  for select using (
    exists (select 1 from items i where i.id = item_id and is_household_member(i.household_id))
  );
create policy "depleted_records_insert_member" on depleted_records
  for insert with check (
    created_by = auth.uid()
    and exists (select 1 from items i where i.id = item_id and is_household_member(i.household_id))
  );
create policy "depleted_records_delete_member" on depleted_records
  for delete using (
    exists (select 1 from items i where i.id = item_id and is_household_member(i.household_id))
  );

-- ---------------------------------------------------------------------------
-- RPCs de onboarding (únicas vias de escrita em households/household_members)
-- ---------------------------------------------------------------------------

-- Cria household e vincula o usuário autenticado como primeiro membro.
create or replace function create_household(household_name text)
returns households
language plpgsql
security definer
set search_path = public
as $$
declare
  new_household households;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if exists (select 1 from household_members where user_id = auth.uid()) then
    raise exception 'user already belongs to a household';
  end if;

  insert into households (name) values (household_name) returning * into new_household;
  insert into household_members (household_id, user_id) values (new_household.id, auth.uid());
  return new_household;
end;
$$;

-- Entra em um household existente pelo código de convite.
-- Limite de 2 membros (casal) — MVP-SCOPE.md.
create or replace function join_household_by_code(code text)
returns households
language plpgsql
security definer
set search_path = public
as $$
declare
  target households;
  member_count int;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if exists (select 1 from household_members where user_id = auth.uid()) then
    raise exception 'user already belongs to a household';
  end if;

  select * into target from households where invite_code = upper(trim(code));
  if target.id is null then
    raise exception 'invalid invite code';
  end if;

  select count(*) into member_count from household_members where household_id = target.id;
  if member_count >= 2 then
    raise exception 'household is full';
  end if;

  insert into household_members (household_id, user_id) values (target.id, auth.uid());
  return target;
end;
$$;
