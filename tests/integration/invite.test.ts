// @vitest-environment node
// Convite e vínculo do segundo usuário ao household (TODOS.md Fase 7).

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Client } from "pg";
import { asAdmin, asUser, connect, createUser, databaseUrl } from "./helpers";

const run = databaseUrl() ? describe : describe.skip;

run("Convite de household", () => {
  let db: Client;
  let founder: string;
  let partner: string;
  let third: string;
  let householdId: string;
  let inviteCode: string;

  beforeAll(async () => {
    db = await connect();
    founder = await createUser(db, `founder-${Date.now()}@invite.test`);
    partner = await createUser(db, `partner-${Date.now()}@invite.test`);
    third = await createUser(db, `third-${Date.now()}@invite.test`);

    await asUser(db, founder);
    const { rows } = await db.query(
      "select id, invite_code from create_household('Casa Convite')"
    );
    householdId = rows[0].id;
    inviteCode = rows[0].invite_code;
  });

  afterAll(async () => {
    await asAdmin(db);
    await db.end();
  });

  it("código inválido é rejeitado", async () => {
    await asUser(db, partner);
    await expect(db.query("select join_household_by_code('XXXXXX')")).rejects.toThrow(
      /invalid invite code/
    );
  });

  it("segundo usuário entra pelo código e compartilha o mesmo household_id", async () => {
    await asUser(db, partner);
    const { rows } = await db.query("select id from join_household_by_code($1)", [inviteCode]);
    expect(rows[0].id).toBe(householdId);

    // ambos aparecem como membros para os dois lados
    const members = await db.query(
      "select user_id from household_members where household_id = $1 order by created_at",
      [householdId]
    );
    expect(members.rows.map((r) => r.user_id).sort()).toEqual([founder, partner].sort());
  });

  it("parceiro passa a ver os dados da despensa compartilhada", async () => {
    await asUser(db, founder);
    await db.query("insert into items (household_id, name, unit) values ($1, 'Café', 'g')", [
      householdId,
    ]);

    await asUser(db, partner);
    const { rows } = await db.query("select name from items where household_id = $1", [
      householdId,
    ]);
    expect(rows.map((r) => r.name)).toContain("Café");
  });

  it("quem já tem household não entra em outro", async () => {
    await asUser(db, partner);
    await expect(db.query("select join_household_by_code($1)", [inviteCode])).rejects.toThrow(
      /already belongs/
    );
  });

  it("household cheio (2 membros) recusa o terceiro", async () => {
    await asUser(db, third);
    await expect(db.query("select join_household_by_code($1)", [inviteCode])).rejects.toThrow(
      /household is full/
    );
  });
});
