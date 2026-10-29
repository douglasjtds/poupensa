// Helpers dos testes de integração.
//
// Os testes rodam contra um Postgres com as migrations reais + shim do schema
// auth (supabase/test/). A troca de "usuário logado" replica o que o PostgREST
// faz: `set role authenticated` + GUC request.jwt.claim.sub consumido por
// auth.uid(). Rode via `npm run test:integration:local` (sobe o banco sozinho)
// ou exporte TEST_DATABASE_URL para um banco já preparado.

import { Client } from "pg";

export function databaseUrl(): string | undefined {
  return process.env.TEST_DATABASE_URL;
}

export async function connect(): Promise<Client> {
  const client = new Client({ connectionString: databaseUrl() });
  await client.connect();
  return client;
}

/** Cria um usuário direto em auth.users (contexto admin). */
export async function createUser(admin: Client, email: string): Promise<string> {
  const { rows } = await admin.query<{ id: string }>(
    "insert into auth.users (id, email) values (gen_random_uuid(), $1) returning id",
    [email]
  );
  return rows[0].id;
}

/** Passa a sessão a agir como um usuário autenticado (como o PostgREST faz). */
export async function asUser(client: Client, userId: string): Promise<void> {
  await client.query("reset role");
  await client.query("select set_config('request.jwt.claim.sub', $1, false)", [userId]);
  await client.query("set role authenticated");
}

/** Volta ao contexto administrador (dono da conexão). */
export async function asAdmin(client: Client): Promise<void> {
  await client.query("reset role");
  await client.query("select set_config('request.jwt.claim.sub', '', false)");
}
