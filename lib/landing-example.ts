// Exemplos numéricos da landing page: toda quantidade sugerida exibida lá sai
// daqui, do mesmo cálculo que o app usa, nunca de um número escrito à mão.

import { calculateSuggestion } from "@/lib/domain/suggestion";

// As datas são fictícias: para o cálculo só importa a distância entre elas.
const PURCHASE_DATE_UTC = Date.UTC(2026, 0, 1);
const MS_PER_DAY = 86_400_000;

function toISODate(utcMs: number): string {
  return new Date(utcMs).toISOString().slice(0, 10);
}

/**
 * Quantidade sugerida para a próxima compra de um item comprado (`bought`) e
 * conferido `cycleDays` dias depois com `left` sobrando.
 */
export function nextPurchase(bought: number, left: number, cycleDays = 30): number {
  const { quantity } = calculateSuggestion({
    purchases: [{ quantity: bought, date: toISODate(PURCHASE_DATE_UTC) }],
    checks: [{ quantityLeft: left, date: toISODate(PURCHASE_DATE_UTC + cycleDays * MS_PER_DAY) }],
    depletions: [],
  });
  return quantity ?? 0; // null só ocorre com compra zerada: nada a sugerir
}
