-- Grants equivalentes aos defaults do Supabase para o role authenticated
-- (aplicar DEPOIS das migrations; RLS continua valendo por cima).
grant usage on schema public to authenticated;
grant all on all tables in schema public to authenticated;
grant execute on all functions in schema public to authenticated;
