import { describe, expect, it } from "vitest";
import { calculateSuggestion, daysBetween, type SuggestionInput } from "@/lib/domain/suggestion";

function input(partial: Partial<SuggestionInput>): SuggestionInput {
  return { purchases: [], checks: [], depletions: [], ...partial };
}

describe("daysBetween", () => {
  it("conta dias entre datas ISO", () => {
    expect(daysBetween("2026-06-01", "2026-07-01")).toBe(30);
    expect(daysBetween("2026-01-01", "2026-01-02")).toBe(1);
    expect(daysBetween("2026-01-01", "2026-01-01")).toBe(0);
  });
});

describe("calculateSuggestion — caso normal (comprou X, sobrou Y)", () => {
  it("projeta o consumo do ciclo e desconta a sobra", () => {
    const s = calculateSuggestion(
      input({
        purchases: [{ quantity: 5, date: "2026-06-01" }],
        checks: [{ quantityLeft: 1.5, date: "2026-07-01" }],
      })
    );
    // consumiu 3.5 em 30 dias; próximo ciclo (30d) precisa de 3.5, menos 1.5 já em casa
    expect(s.basis).toBe("check");
    expect(s.quantity).toBe(2);
    expect(s.leftover).toBe(1.5);
    expect(s.dailyConsumption).toBeCloseTo(3.5 / 30, 2);
  });

  it("respeita targetCycleDays customizado", () => {
    const s = calculateSuggestion(
      input({
        purchases: [{ quantity: 5, date: "2026-06-01" }],
        checks: [{ quantityLeft: 1.5, date: "2026-07-01" }],
        targetCycleDays: 60,
      })
    );
    // 3.5/30 por dia × 60 dias = 7, menos 1.5 de sobra = 5.5
    expect(s.quantity).toBe(5.5);
  });

  it("soma reposições feitas dentro do mesmo ciclo", () => {
    const s = calculateSuggestion(
      input({
        purchases: [
          { quantity: 2, date: "2026-06-01" },
          { quantity: 2, date: "2026-06-15" },
        ],
        checks: [
          { quantityLeft: 0.2, date: "2026-05-31" }, // fechou o ciclo anterior
          { quantityLeft: 1, date: "2026-07-01" },
        ],
      })
    );
    // comprou 4 no ciclo, sobrou 1 → consumiu 3 em 30d → sugere 3 − 1 = 2
    expect(s.basis).toBe("check");
    expect(s.quantity).toBe(2);
  });

  it("sugere 0 quando nada foi consumido", () => {
    const s = calculateSuggestion(
      input({
        purchases: [{ quantity: 5, date: "2026-06-01" }],
        checks: [{ quantityLeft: 5, date: "2026-07-01" }],
      })
    );
    expect(s.basis).toBe("check");
    expect(s.quantity).toBe(0);
    expect(s.dailyConsumption).toBe(0);
  });

  it("sobra maior que o comprado não gera consumo negativo", () => {
    const s = calculateSuggestion(
      input({
        purchases: [{ quantity: 2, date: "2026-06-01" }],
        checks: [{ quantityLeft: 3, date: "2026-07-01" }], // tinha estoque antigo não registrado
      })
    );
    expect(s.quantity).toBe(0);
    expect(s.dailyConsumption).toBe(0);
  });
});

describe("calculateSuggestion — item novo sem histórico", () => {
  it("não sugere nada sem compras", () => {
    const s = calculateSuggestion(input({}));
    expect(s.basis).toBe("no-history");
    expect(s.quantity).toBeNull();
    expect(s.dailyConsumption).toBeNull();
    expect(s.leftover).toBeNull();
  });

  it("conferência sem nenhuma compra continua sem histórico", () => {
    const s = calculateSuggestion(input({ checks: [{ quantityLeft: 2, date: "2026-07-01" }] }));
    expect(s.basis).toBe("no-history");
    expect(s.quantity).toBeNull();
  });
});

describe("calculateSuggestion — conferência pulada (gap de dados)", () => {
  it("repete a última compra quando nunca houve conferência", () => {
    const s = calculateSuggestion(input({ purchases: [{ quantity: 4, date: "2026-06-01" }] }));
    expect(s.basis).toBe("no-check");
    expect(s.quantity).toBe(4);
    expect(s.dailyConsumption).toBeNull();
  });

  it("usa só o último evento de compra quando várias conferências foram puladas", () => {
    const s = calculateSuggestion(
      input({
        purchases: [
          { quantity: 4, date: "2026-05-01" },
          { quantity: 4, date: "2026-06-01" },
          { quantity: 3, date: "2026-07-01" },
        ],
      })
    );
    // não infla somando ciclos antigos: repete o evento mais recente
    expect(s.basis).toBe("no-check");
    expect(s.quantity).toBe(3);
  });

  it("gap após um ciclo conferido: repete a última compra", () => {
    const s = calculateSuggestion(
      input({
        purchases: [
          { quantity: 4, date: "2026-05-01" },
          { quantity: 4, date: "2026-06-01" },
          { quantity: 4, date: "2026-07-01" },
        ],
        checks: [{ quantityLeft: 0.5, date: "2026-05-30" }],
      })
    );
    expect(s.basis).toBe("no-check");
    expect(s.quantity).toBe(4);
  });

  it("soma compras do mesmo dia como um único evento", () => {
    const s = calculateSuggestion(
      input({
        purchases: [
          { quantity: 2, date: "2026-07-01" },
          { quantity: 1, date: "2026-07-01" },
        ],
      })
    );
    expect(s.quantity).toBe(3);
  });
});

describe("calculateSuggestion — 'acabou' registrado no meio do ciclo", () => {
  it("escala pela duração real quando acabou antes da conferência", () => {
    const s = calculateSuggestion(
      input({
        purchases: [{ quantity: 1000, date: "2026-06-01" }],
        depletions: [{ date: "2026-06-11" }],
        checks: [{ quantityLeft: 0, date: "2026-07-01" }],
      })
    );
    // 1000 durou 10 dias → 100/dia → ciclo de 30 dias precisa de 3000
    expect(s.basis).toBe("depleted");
    expect(s.quantity).toBe(3000);
    expect(s.dailyConsumption).toBe(100);
    expect(s.leftover).toBe(0);
  });

  it("funciona sem conferência formal (só o 'acabou')", () => {
    const s = calculateSuggestion(
      input({
        purchases: [{ quantity: 2, date: "2026-06-01" }],
        depletions: [{ date: "2026-06-16" }],
      })
    );
    // durou 15 dias → 2/15 por dia × 30 dias (default) = 4
    expect(s.basis).toBe("depleted");
    expect(s.quantity).toBe(4);
  });

  it("ignora 'acabou' de ciclos anteriores", () => {
    const s = calculateSuggestion(
      input({
        purchases: [
          { quantity: 5, date: "2026-05-01" },
          { quantity: 5, date: "2026-06-01" },
        ],
        depletions: [{ date: "2026-05-20" }],
        checks: [
          { quantityLeft: 0.5, date: "2026-05-30" },
          { quantityLeft: 1, date: "2026-07-01" },
        ],
      })
    );
    // o 'acabou' de maio pertence ao ciclo fechado pela conferência de 30/05
    expect(s.basis).toBe("check");
    expect(s.quantity).toBe(3); // consumiu 4 em 30d → 4 − 1 de sobra
  });

  it("com reposição no ciclo, ancora no início do ciclo conferido", () => {
    const s = calculateSuggestion(
      input({
        purchases: [
          { quantity: 2, date: "2026-06-01" },
          { quantity: 2, date: "2026-06-15" },
        ],
        depletions: [{ date: "2026-06-25" }],
        checks: [
          { quantityLeft: 0.2, date: "2026-05-31" },
          { quantityLeft: 0, date: "2026-07-01" },
        ],
      })
    );
    // 4 durou 24 dias → 1/6 por dia × 30 dias = 5
    expect(s.basis).toBe("depleted");
    expect(s.quantity).toBe(5);
  });

  it("acabou no mesmo dia da compra usa duração mínima de 1 dia", () => {
    const s = calculateSuggestion(
      input({
        purchases: [{ quantity: 5, date: "2026-06-01" }],
        depletions: [{ date: "2026-06-01" }],
      })
    );
    expect(s.basis).toBe("depleted");
    expect(s.quantity).toBe(150); // 5/dia × 30 — extremo documentado
  });

  it("compra zerada com 'acabou' não gera sugestão", () => {
    const s = calculateSuggestion(
      input({
        purchases: [{ quantity: 0, date: "2026-06-01" }],
        depletions: [{ date: "2026-06-10" }],
      })
    );
    expect(s.basis).toBe("depleted");
    expect(s.quantity).toBeNull();
  });
});

describe("calculateSuggestion — zerou na conferência (sem data de 'acabou')", () => {
  it("aplica buffer fixo sobre a quantidade comprada", () => {
    const s = calculateSuggestion(
      input({
        purchases: [{ quantity: 12, date: "2026-06-01" }],
        checks: [{ quantityLeft: 0, date: "2026-07-01" }],
      })
    );
    expect(s.basis).toBe("ran-out-at-check");
    expect(s.quantity).toBe(14.4); // 12 × (1 + RAN_OUT_BUFFER), arredondado
    expect(s.leftover).toBe(0);
  });

  it("compra zero + sobra zero não gera sugestão", () => {
    const s = calculateSuggestion(
      input({
        purchases: [{ quantity: 0, date: "2026-06-01" }],
        checks: [{ quantityLeft: 0, date: "2026-07-01" }],
      })
    );
    expect(s.basis).toBe("ran-out-at-check");
    expect(s.quantity).toBeNull();
  });
});
