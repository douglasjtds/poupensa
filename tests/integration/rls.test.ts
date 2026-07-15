// @vitest-environment node
// RLS: usuário de um household não lê nem escreve dados de outro household,
// mesmo autenticado (TODOS.md Fase 7).

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Client } from "pg";
import { asAdmin, asUser, connect, createUser, databaseUrl } from "./helpers";

const run = databaseUrl() ? describe : describe.skip;

run("RLS entre households", () => {
  let db: Client;
  let userA: string;
  let userB: string;
  let householdA: string;
  let itemA: string;

  beforeAll(async () => {
    db = await connect();
    userA = await createUser(db, `a-${Date.now()}@rls.test`);
    userB = await createUser(db, `b-${Date.now()}@rls.test`);

    await asUser(db, userA);
    const { rows: hh } = await db.query("select id from create_household('Casa A')");
    householdA = hh[0].id;
    const { rows: item } = await db.query(
      "insert into items (household_id, name, unit) values ($1, 'Arroz', 'kg') returning id",
      [householdA]
    );
    itemA = item[0].id;
    await db.query(
      "insert into purchase_records (item_id, quantity, purchased_at, created_by) values ($1, 5, '2026-06-01', $2)",
      [itemA, userA]
    );

    await asUser(db, userB);
    await db.query("select id from create_household('Casa B')");
  });

  afterAll(async () => {
    await asAdmin(db);
    await db.end();
  });

  it("membro vê os próprios dados", async () => {
    await asUser(db, userA);
    const { rows } = await db.query("select * from items");
    expect(rows).toHaveLength(1);
    expect(rows[0].name).toBe("Arroz");
  });

  it("não-membro não lê household, itens nem registros do outro casal", async () => {
    await asUser(db, userB);
    const households = await db.query("select * from households where id = $1", [householdA]);
    expect(households.rows).toHaveLength(0);

    const items = await db.query("select * from items where household_id = $1", [householdA]);
    expect(items.rows).toHaveLength(0);

    const purchases = await db.query("select * from purchase_records where item_id = $1", [itemA]);
    expect(purchases.rows).toHaveLength(0);
  });

  it("não-membro não insere item no household alheio", async () => {
    await asUser(db, userB);
    await expect(
      db.query("insert into items (household_id, name, unit) values ($1, 'Invasor', 'un')", [
        householdA,
      ])
    ).rejects.toThrow(/row-level security/);
  });

  it("não-membro não insere registro de compra em item alheio", async () => {
    await asUser(db, userB);
    await expect(
      db.query(
        "insert into purchase_records (item_id, quantity, created_by) values ($1, 99, $2)",
        [itemA, userB]
      )
    ).rejects.toThrow(/row-level security/);
  });

  it("não-membro não atualiza nem deleta item alheio (0 linhas afetadas)", async () => {
    await asUser(db, userB);
    const upd = await db.query("update items set name = 'Hack' where id = $1", [itemA]);
    expect(upd.rowCount).toBe(0);
    const del = await db.query("delete from items where id = $1", [itemA]);
    expect(del.rowCount).toBe(0);
  });

  it("insert de registro exige created_by = usuário autenticado", async () => {
    await asUser(db, userA);
    await expect(
      db.query(
        "insert into purchase_records (item_id, quantity, created_by) values ($1, 1, $2)",
        [itemA, userB] // tenta atribuir a outro usuário
      )
    ).rejects.toThrow(/row-level security/);
  });
});
