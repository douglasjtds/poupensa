-- Simula um projeto Supabase sem exposição automática de tabelas na Data API
-- (padrão desde 30/10/2026): os roles só têm acesso ao schema. As permissões
-- em tabelas e funções precisam vir das migrations (ver 00004).
-- Aplicar DEPOIS das migrations; RLS continua valendo por cima.
grant usage on schema public to authenticated, service_role;

-- O Postgres puro concede EXECUTE a PUBLIC em toda função nova. Revogar aqui
-- garante que os testes acusem uma função sem grant explícito.
revoke execute on all functions in schema public from public;
