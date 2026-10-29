// Validações de formulário compartilhadas (testadas em tests/unit).

export type ValidationResult = { ok: true } | { ok: false; error: string };

/**
 * Converte texto numérico no formato pt-BR. Com vírgula, os pontos são
 * separadores de milhar ("1.000,5"); sem vírgula, só "1.000"/"12.500" (grupos
 * de 3) são milhar — "1.5" segue como decimal (teclado com ponto).
 */
function normalizeNumber(raw: string): number {
  const text = raw.trim();
  if (text.includes(",")) return Number(text.replace(/\./g, "").replace(",", "."));
  if (/^\d{1,3}(\.\d{3})+$/.test(text)) return Number(text.replace(/\./g, ""));
  return Number(text);
}

export function validateQuantity(raw: string | number): ValidationResult {
  const value = typeof raw === "string" ? normalizeNumber(raw) : raw;
  if (raw === "" || Number.isNaN(value)) {
    return { ok: false, error: "Informe uma quantidade" };
  }
  if (!Number.isFinite(value)) {
    return { ok: false, error: "Quantidade inválida" };
  }
  if (value < 0) {
    return { ok: false, error: "Quantidade não pode ser negativa" };
  }
  return { ok: true };
}

export function parseQuantity(raw: string): number {
  return normalizeNumber(raw);
}

export function validateItemName(name: string): ValidationResult {
  if (!name.trim()) {
    return { ok: false, error: "Informe o nome do item" };
  }
  if (name.trim().length > 80) {
    return { ok: false, error: "Nome muito longo (máx. 80 caracteres)" };
  }
  return { ok: true };
}

export function validateUnit(unit: string): ValidationResult {
  if (!unit.trim()) {
    return { ok: false, error: "Informe a unidade" };
  }
  return { ok: true };
}

export function validateInviteCode(code: string): ValidationResult {
  if (!/^[a-zA-Z0-9]{6}$/.test(code.trim())) {
    return { ok: false, error: "Código de convite tem 6 letras/números" };
  }
  return { ok: true };
}

/**
 * Destino pós-login vindo da URL (`?next=`). Só aceita caminho relativo do
 * próprio app; "//host", "/\\host" e URLs absolutas viram o fallback, para
 * não virar open redirect.
 */
export function safeNextPath(next: string | null | undefined, fallback = "/despensa"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return fallback;
  }
  return next;
}

export const UNITS = ["un", "kg", "g", "L", "ml", "pacote", "caixa", "rolo", "dúzia"] as const;
