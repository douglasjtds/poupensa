// Formatação de números para exibição em pt-BR.

export interface Unit {
  singular: string;
  plural: string;
}

/**
 * Número para exibição: vírgula decimal, no máximo 2 casas, sem zeros sobrando.
 * Ex.: 2 => "2", 0.5 => "0,5", 1 / 3 => "0,33".
 *
 * Só para leitura. Campos editáveis usam o valor sem arredondar
 * (`formatQuantityForInput` em lib/domain/voice.ts), para não perder precisão.
 */
export function formatDecimal(value: number): string {
  return String(Math.round(value * 100) / 100).replace(".", ",");
}

/** Ex.: formatQuantity(2, { singular: "caixa", plural: "caixas" }) => "2 caixas". */
export function formatQuantity(value: number, unit: Unit): string {
  return `${formatDecimal(value)} ${value === 1 ? unit.singular : unit.plural}`;
}
