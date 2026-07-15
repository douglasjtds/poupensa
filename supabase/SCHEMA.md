# Poupensa — Schema e RLS

Documentação do schema final da Fase 2 (ver migrations em `supabase/migrations/`).

## Tabelas

| Tabela | Propósito | Colunas principais |
|---|---|---|
| `households` | Unidade familiar (casal) | `id`, `name`, `invite_code` (único, 6 chars), `created_at` |
| `household_members` | Vínculo usuário↔household (máx. 2 no MVP) | PK composta (`household_id`, `user_id`) |
| `items` | Cadastro de item da despensa | `id`, `household_id`, `name` (único por household), `unit` |
| `purchase_records` | Quanto foi comprado, quando | `item_id`, `quantity ≥ 0`, `purchased_at`, `created_by` |
| `check_records` | Quanto restou na conferência | `item_id`, `quantity_left ≥ 0`, `checked_at`, `created_by` |
| `depleted_records` | "Acabou" no meio do ciclo (opcional) | `item_id`, `depleted_at`, `created_by` |

Quantidades são `numeric` (aceitam 1.5 kg). Datas de evento são `date` (dia é a
granularidade do produto); `created_at` é `timestamptz` para auditoria.

## RLS — policies por tabela

Helper: `is_household_member(hid uuid)` — `security definer`, evita recursão de
RLS ao consultar `household_members`.

| Tabela | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `households` | membro | ❌ (só RPC) | membro | ❌ |
| `household_members` | membro do household | ❌ (só RPC) | ❌ | ❌ |
| `items` | membro | membro | membro | membro |
| `purchase_records` | membro (via item) | membro (via item) + `created_by = auth.uid()` | membro (via item) | membro (via item) |
| `check_records` | membro (via item) | membro (via item) + `created_by = auth.uid()` | membro (via item) | membro (via item) |
| `depleted_records` | membro (via item) | membro (via item) + `created_by = auth.uid()` | ❌ | membro (via item) |

"Membro (via item)" = `exists (select 1 from items i where i.id = item_id and is_household_member(i.household_id))`.

## RPCs (únicas vias de escrita em households/household_members)

- `create_household(household_name text)` — cria household + vincula o usuário
  autenticado como primeiro membro. Falha se o usuário já tem household.
- `join_household_by_code(code text)` — entra pelo código de convite. Falha se
  código inválido, se o usuário já tem household, ou se o household já tem 2
  membros.

Ambas `security definer` com `search_path = public`.

## Seed

`supabase/seed.sql` — aplicado por `supabase db reset` no ambiente local:
- 2 usuários: `douglas@teste.poupensa.app` / `iara@teste.poupensa.app` (senha `password123`)
- Household `Casa Douglas & Iara` (convite `CASA01`)
- 6 itens; compra de 35 dias atrás; conferência de ontem com um item sem
  conferência (gap proposital) e café com "acabou" no meio do ciclo.
