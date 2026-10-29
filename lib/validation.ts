// Validações de formulário compartilhadas (testadas em tests/unit).

export type ValidationResult = { ok: true } | { ok: false; error: string };

export function validateQuantity(raw: string | number): ValidationResult {
  const value = typeof raw === "string" ? Number(raw.replace(",", ".")) : raw;
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
  return Number(raw.replace(",", "."));
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

export const UNITS = ["un", "kg", "g", "L", "ml", "pacote", "caixa", "rolo", "dúzia"] as const;
