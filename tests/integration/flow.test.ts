// @vitest-environment node
// Fluxo completo compra → conferência → lista gerada, com persistência real
// e os dois membros do casal registrando etapas diferentes (TODOS.md Fase 7).

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Client } from "pg";
import { asAdmin, asUser, connect, createUser, databaseUrl } from "./helpers";
import { calculateSuggestion } from "@/lib/domain/suggestion";

const run = databaseUrl() ? describe : describe.skip;

type Records = {
  purchases: { quantity: number; date: string }[];
  checks: { quantityLeft: number; date: string }[];
  depletions: { date: string }[];
};

async function loadRecords(db: Client, itemId: string): Promise<Records> {
  const purchases = await db.query(
    "select quantity::float as quantity, purchased_at::text as date from purchase_records where item_id = $1",
    [itemId]
  );
  const checks = await db.query(
    "select quantity_left::float as quantity_left, checked_at::text as date from check_records where item_id = $1",
    [itemId]
  );
  const depletions = await db.query(
    "select depleted_at::text as date from depleted_records where item_id = $1",
    [itemId]
  );
  return {
    purchases: purchases.rows.map((r) => ({ quantity: r.quantity, date: r.date })),
    checks: checks.rows.map((r) => ({ quantityLeft: r.quantity_left, date: r.date })),
    depletions: depletions.rows.map((r) => ({ date: r.date })),
  };
}

run("Fluxo compra → conferência → lista", () => {
  let db: Client;
  let douglas: string;
  let iara: string;
  let householdId: string;
  let arrozId: string;
  let cafeId: string;

  beforeAll(async () => {
    db = await connect();
    douglas = await createUser(db, `douglas-${Date.now()}@flow.test`);
    iara = await createUser(db, `iara-${Date.now()}@flow.test`);

    // Douglas cria o household e a Iara entra pelo convite
    await asUser(db, douglas);
    const { rows: hh } = await db.query(
      "select id, invite_code from create_household('Casa Fluxo')"
    );
    householdId = hh[0].id;
    await asUser(db, iara);
    await db.query("select join_household_by_code($1)", [hh[0].invite_code]);
  });

  afterAll(async () => {
    await asAdmin(db);
    await db.end();
  });

  it("Douglas cadastra itens e registra a compra do mês", async () => {
    await asUser(db, douglas);
    const { rows: arroz } = await db.query(
      "insert into items (household_id, name, unit) values ($1, 'Arroz', 'kg') returning id",
      [householdId]
    );
    arrozId = arroz[0].id;
    const { rows: cafe } = await db.query(
      "insert into items (household_id, name, unit) values ($1, 'Café', 'g') returning id",
      [householdId]
    );
    cafeId = cafe[0].id;

    await db.query(
      `insert into purchase_records (item_id, quantity, purchased_at, created_by)
       values ($1, 5, '2026-06-01', $3), ($2, 1000, '2026-06-01', $3)`,
      [arrozId, cafeId, douglas]
    );

    const { rows } = await db.query(
      "select count(*)::int as n from purchase_records where item_id in ($1, $2)",
      [arrozId, cafeId]
    );
    expect(rows[0].n).toBe(2);
  });

  it("Iara vê a compra do Douglas e registra 'acabou' + conferência", async () => {
    await asUser(db, iara);

    // visibilidade cruzada: registro criado pelo parceiro
    const { rows: visible } = await db.query(
      "select quantity::float as q from purchase_records where item_id = $1",
      [arrozId]
    );
    expect(visible[0].q).toBe(5);

    // café acabou no meio do ciclo
    await db.query(
      "insert into depleted_records (item_id, depleted_at, created_by) values ($1, '2026-06-11', $2)",
      [cafeId, iara]
    );
    // conferência pré-compra
    await db.query(
      `insert into check_records (item_id, quantity_left, checked_at, created_by)
       values ($1, 1.5, '2026-07-01', $3), ($2, 0, '2026-07-01', $3)`,
      [arrozId, cafeId, iara]
    );

    const { rows } = await db.query(
      "select count(*)::int as n from check_records where item_id in ($1, $2)",
      [arrozId, cafeId]
    );
    expect(rows[0].n).toBe(2);
  });

  it("a lista gerada a partir dos dados persistidos traz as sugestões corretas", async () => {
    await asUser(db, douglas);

    const arroz = await loadRecords(db, arrozId);
    const sArroz = calculateSuggestion(arroz);
    // comprou 5, sobrou 1.5 em 30 dias → consome 3.5 → sugere 3.5 − 1.5 = 2
    expect(sArroz.basis).toBe("check");
    expect(sArroz.quantity).toBe(2);

    const cafe = await loadRecords(db, cafeId);
    const sCafe = calculateSuggestion(cafe);
    // 1000g duraram 10 dias → 100/dia → ciclo de 30 dias = 3000
    expect(sCafe.basis).toBe("depleted");
    expect(sCafe.quantity).toBe(3000);
  });
});
