// Cálculo de sugestão de quantidade — o coração do Poupensa.
// Módulo puro: sem React, sem Supabase, sem I/O (regra do CLAUDE.md).
//
// Modelo: um "ciclo" vai da compra grande até a conferência seguinte.
// A sugestão para o próximo ciclo parte do consumo observado:
//
//   - Com conferência:   consumo = comprado − sobrou, projetado para a duração
//                        alvo do próximo ciclo, descontando o que ainda resta.
//   - Com "acabou":      o item durou (acabou − início) dias; consumo diário =
//                        comprado / dias até acabar; sugestão cobre o ciclo
//                        inteiro nessa taxa.
//   - Sem conferência:   repete a última compra (soma do último dia de compra —
//                        "usar último dado disponível", PRD.md; usar só o último
//                        evento evita inflar quando conferências foram puladas
//                        por vários ciclos).
//   - Sem histórico:     não há sugestão automática (item novo).
//
// Todas as datas são strings YYYY-MM-DD (granularidade de dia do produto).

export type PurchaseEvent = { quantity: number; date: string };
export type CheckEvent = { quantityLeft: number; date: string };
export type DepletedEvent = { date: string };

export type SuggestionBasis =
  | "no-history" // item novo: nunca comprado
  | "no-check" // comprado, mas conferência pulada: repete última compra
  | "check" // comprado + conferido: ajusta pelo que sobrou
  | "depleted" // acabou no meio do ciclo: escala pela duração real
  | "ran-out-at-check"; // conferido com 0 e sem data de "acabou": buffer fixo

export type Suggestion = {
  /** Quantidade sugerida para o próximo ciclo (null se não há como sugerir). */
  quantity: number | null;
  basis: SuggestionBasis;
  /** Consumo por dia observado, quando calculável. */
  dailyConsumption: number | null;
  /** Sobra registrada na conferência do ciclo (null sem conferência). */
  leftover: number | null;
};

export type SuggestionInput = {
  purchases: PurchaseEvent[];
  checks: CheckEvent[];
  depletions: DepletedEvent[];
  /**
   * Duração-alvo do próximo ciclo em dias. Default: a duração observada do
   * ciclo atual (compra → conferência); 30 quando não há como observar.
   */
  targetCycleDays?: number;
};

const DEFAULT_CYCLE_DAYS = 30;
/** Uplift quando o item zerou na conferência sem data de "acabou" conhecida. */
export const RAN_OUT_BUFFER = 0.2;

export function daysBetween(a: string, b: string): number {
  const ms = Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}

/** Arredonda para 2 casas para evitar ruído de ponto flutuante na UI. */
function round(n: number): number {
  return Math.round(n * 100) / 100;
}

function sumQty(events: PurchaseEvent[]): number {
  return events.reduce((sum, p) => sum + p.quantity, 0);
}

/**
 * Calcula a sugestão de quantidade de UM item para o próximo ciclo.
 *
 * Seleção do ciclo atual:
 * - `prevCheck` é a última conferência ANTERIOR à última compra — ela fecha o
 *   ciclo anterior. O ciclo atual começa na primeira compra depois dela
 *   (reposições no meio do ciclo somam na quantidade comprada).
 * - Sem conferência anterior, o ciclo atual começa na primeira compra
 *   registrada (cobre o caso comum: estoque inicial + compra antes da
 *   primeira conferência).
 */
export function calculateSuggestion(input: SuggestionInput): Suggestion {
  const purchases = [...input.purchases].sort((a, b) => a.date.localeCompare(b.date));

  if (purchases.length === 0) {
    return { quantity: null, basis: "no-history", dailyConsumption: null, leftover: null };
  }

  const lastPurchase = purchases[purchases.length - 1];
  const checksSorted = [...input.checks].sort((a, b) => a.date.localeCompare(b.date));
  const prevCheck = [...checksSorted].reverse().find((c) => c.date < lastPurchase.date);

  const cyclePurchases = prevCheck ? purchases.filter((p) => p.date >= prevCheck.date) : purchases;
  const cycleStart = cyclePurchases[0].date;

  // Conferência do ciclo atual (a mais recente em/depois do início do ciclo).
  const cycleChecks = checksSorted.filter((c) => c.date >= cycleStart);
  const check = cycleChecks[cycleChecks.length - 1];

  // "Acabou" dentro do ciclo (antes da conferência, se ela existir).
  const cycleDepletions = input.depletions
    .filter((d) => d.date >= cycleStart && (!check || d.date <= check.date))
    .sort((a, b) => a.date.localeCompare(b.date));
  const depletion = cycleDepletions[0];

  // ---- "Acabou" registrado: duração real conhecida → escala para o alvo ----
  if (depletion) {
    // Âncora do consumo: com fronteira de ciclo conhecida usa o início do
    // ciclo; sem nenhuma conferência na história, ancora na última compra
    // antes do "acabou" (evita atravessar ciclos antigos sem fronteira).
    const anchor = prevCheck
      ? cycleStart
      : ([...cyclePurchases].reverse().find((p) => p.date <= depletion.date)?.date ?? cycleStart);
    const purchased = sumQty(
      cyclePurchases.filter((p) => p.date >= anchor && p.date <= depletion.date)
    );
    if (purchased <= 0) {
      return {
        quantity: null,
        basis: "depleted",
        dailyConsumption: null,
        leftover: check ? check.quantityLeft : 0,
      };
    }
    const lastedDays = Math.max(1, daysBetween(anchor, depletion.date));
    const targetDays =
      input.targetCycleDays ??
      (check ? Math.max(1, daysBetween(anchor, check.date)) : DEFAULT_CYCLE_DAYS);
    const daily = purchased / lastedDays;
    return {
      quantity: round(daily * targetDays),
      basis: "depleted",
      dailyConsumption: round(daily),
      leftover: check ? check.quantityLeft : 0,
    };
  }

  // ---- Conferência pulada: repete o último evento de compra ----
  if (!check) {
    const lastEventQty = sumQty(purchases.filter((p) => p.date === lastPurchase.date));
    return {
      quantity: round(lastEventQty),
      basis: "no-check",
      dailyConsumption: null,
      leftover: null,
    };
  }

  const purchased = sumQty(cyclePurchases.filter((p) => p.date <= check.date));
  const cycleDays = Math.max(1, daysBetween(cycleStart, check.date));
  const targetDays = input.targetCycleDays ?? cycleDays;

  // ---- Zerou na conferência sem "acabou" registrado ----
  // Insuficiente por margem desconhecida → última compra + buffer fixo.
  if (check.quantityLeft <= 0) {
    if (purchased <= 0) {
      return { quantity: null, basis: "ran-out-at-check", dailyConsumption: null, leftover: 0 };
    }
    return {
      quantity: round(purchased * (1 + RAN_OUT_BUFFER)),
      basis: "ran-out-at-check",
      dailyConsumption: round(purchased / cycleDays),
      leftover: 0,
    };
  }

  // ---- Caso normal: consumo = comprado − sobrou ----
  const consumed = Math.max(0, purchased - check.quantityLeft);
  const daily = consumed / cycleDays;
  const nextQuantity = Math.max(0, daily * targetDays - check.quantityLeft);

  return {
    quantity: round(nextQuantity),
    basis: "check",
    dailyConsumption: round(daily),
    leftover: check.quantityLeft,
  };
}
