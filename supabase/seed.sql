-- Poupensa — seed de desenvolvimento/teste
-- Household de teste com 2 usuários, 6 itens, compras do ciclo anterior,
-- conferências recentes e um "acabou" no meio do ciclo.
-- Uso: `supabase db reset` (o CLI aplica migrations + este seed) — APENAS local.
-- Senha dos dois usuários: password123

-- Usuários de teste direto em auth.users (padrão para seed local do Supabase).
insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
)
values
  (
    '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'douglas@teste.poupensa.app',
    crypt('password123', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}', '{"name":"Douglas"}',
    now(), now()
  ),
  (
    '22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'iara@teste.poupensa.app',
    crypt('password123', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}', '{"name":"Iara"}',
    now(), now()
  );

insert into auth.identities (
  id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
)
values
  (
    gen_random_uuid(), '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    '{"sub":"11111111-1111-1111-1111-111111111111","email":"douglas@teste.poupensa.app"}',
    'email', now(), now(), now()
  ),
  (
    gen_random_uuid(), '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    '{"sub":"22222222-2222-2222-2222-222222222222","email":"iara@teste.poupensa.app"}',
    'email', now(), now(), now()
  );

-- Household compartilhado
insert into households (id, name, invite_code)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Casa Douglas & Iara', 'CASA01');

insert into household_members (household_id, user_id)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222');

-- Itens da despensa
insert into items (id, household_id, name, unit)
values
  ('b0000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Arroz', 'kg'),
  ('b0000000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Feijão', 'kg'),
  ('b0000000-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Café', 'g'),
  ('b0000000-0000-0000-0000-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Leite', 'L'),
  ('b0000000-0000-0000-0000-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Papel higiênico', 'rolo'),
  ('b0000000-0000-0000-0000-000000000006', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Sabão em pó', 'kg');

-- Compra grande de ~35 dias atrás (registrada pelo Douglas)
insert into purchase_records (item_id, quantity, purchased_at, created_by)
values
  ('b0000000-0000-0000-0000-000000000001', 5,    current_date - 35, '11111111-1111-1111-1111-111111111111'),
  ('b0000000-0000-0000-0000-000000000002', 2,    current_date - 35, '11111111-1111-1111-1111-111111111111'),
  ('b0000000-0000-0000-0000-000000000003', 1000, current_date - 35, '11111111-1111-1111-1111-111111111111'),
  ('b0000000-0000-0000-0000-000000000004', 12,   current_date - 35, '11111111-1111-1111-1111-111111111111'),
  ('b0000000-0000-0000-0000-000000000005', 16,   current_date - 35, '11111111-1111-1111-1111-111111111111'),
  ('b0000000-0000-0000-0000-000000000006', 2,    current_date - 35, '11111111-1111-1111-1111-111111111111');

-- Conferência de ontem (registrada pela Iara). O sabão em pó não foi conferido
-- de propósito (cenário de gap de dados). O café acabou no meio do ciclo.
insert into check_records (item_id, quantity_left, checked_at, created_by)
values
  ('b0000000-0000-0000-0000-000000000001', 1.5, current_date - 1, '22222222-2222-2222-2222-222222222222'),
  ('b0000000-0000-0000-0000-000000000002', 0.2, current_date - 1, '22222222-2222-2222-2222-222222222222'),
  ('b0000000-0000-0000-0000-000000000004', 0,   current_date - 1, '22222222-2222-2222-2222-222222222222'),
  ('b0000000-0000-0000-0000-000000000005', 6,   current_date - 1, '22222222-2222-2222-2222-222222222222');

-- Café acabou 10 dias antes da conferência
insert into depleted_records (item_id, depleted_at, created_by)
values
  ('b0000000-0000-0000-0000-000000000003', current_date - 11, '22222222-2222-2222-2222-222222222222');
