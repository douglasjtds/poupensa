-- Grants explícitos para a Data API (PostgREST).
-- Desde 30/10/2026 o Supabase não expõe mais tabelas novas do schema public
-- automaticamente: sem estes grants, toda consulta do app recebe
-- 42501 permission denied antes mesmo de o RLS ser avaliado.
-- https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically
--
-- O RLS (00002) continua decidindo o que cada usuário vê e escreve; os grants
-- só liberam o acesso à tabela. anon fica de fora: todas as policies dependem
-- de auth.uid(), então o app só lê dados com usuário logado.

grant select, insert, update, delete on
  households,
  household_members,
  items,
  purchase_records,
  check_records,
  depleted_records
  to authenticated, service_role;

-- is_household_member é chamada pelas policies no papel de quem consulta;
-- as outras duas são as RPCs de onboarding.
grant execute on function
  is_household_member(uuid),
  create_household(text),
  join_household_by_code(text)
  to authenticated, service_role;
