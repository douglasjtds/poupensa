// Interpretação de quantidade falada (pt-BR) — módulo puro e testável.
// A transcrição nunca é salva direto: o valor extraído vai para o input,
// onde o usuário confere e corrige antes de submeter (regra da Fase 5).

const NUMBER_WORDS: Record<string, number> = {
  zero: 0,
  um: 1,
  uma: 1,
  dois: 2,
  duas: 2,
  três: 3,
  tres: 3,
  quatro: 4,
  cinco: 5,
  seis: 6,
  sete: 7,
  oito: 8,
  nove: 9,
  dez: 10,
  onze: 11,
  doze: 12,
  treze: 13,
  quatorze: 14,
  catorze: 14,
  quinze: 15,
  dezesseis: 16,
  dezessete: 17,
  dezoito: 18,
  dezenove: 19,
  vinte: 20,
  trinta: 30,
  quarenta: 40,
  cinquenta: 50,
  sessenta: 60,
  setenta: 70,
  oitenta: 80,
  noventa: 90,
  cem: 100,
  meio: 0.5,
  meia: 0.5,
};

/**
 * Extrai uma quantidade numérica de uma transcrição de fala.
 * Exemplos: "2" → 2; "1,5" → 1.5; "dois e meio" → 2.5; "meio quilo" → 0.5;
 * "sobrou um pacote" → 1. Retorna null se nenhum número for reconhecido.
 */
export function extractQuantity(transcript: string): number | null {
  const text = transcript.toLowerCase().trim();
  if (!text) return null;

  // Número em dígitos (aceita vírgula ou ponto decimal)
  const digits = text.match(/\d+(?:[.,]\d+)?/);
  if (digits) {
    const value = Number(digits[0].replace(",", "."));
    // "2 e meio" / "1 e meia"
    const half = new RegExp(`${digits[0]}\\s+e\\s+mei[oa]`).test(text) ? 0.5 : 0;
    return value + half;
  }

  // Números por extenso
  const words = text.split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    const base = NUMBER_WORDS[words[i]];
    if (base === undefined) continue;
    // "vinte e cinco", "dois e meio"
    if (words[i + 1] === "e" && NUMBER_WORDS[words[i + 2]] !== undefined) {
      return base + NUMBER_WORDS[words[i + 2]];
    }
    return base;
  }

  return null;
}

/** Formata para o padrão dos inputs do app (vírgula decimal). */
export function formatQuantityForInput(value: number): string {
  return String(value).replace(".", ",");
}
