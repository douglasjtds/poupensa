import { describe, expect, it } from "vitest";
import {
  parseQuantity,
  validateInviteCode,
  validateItemName,
  validateQuantity,
  validateUnit,
} from "@/lib/validation";

describe("validateQuantity", () => {
  it("aceita inteiros e decimais com ponto ou vírgula", () => {
    expect(validateQuantity("5").ok).toBe(true);
    expect(validateQuantity("1.5").ok).toBe(true);
    expect(validateQuantity("1,5").ok).toBe(true);
    expect(validateQuantity(0).ok).toBe(true); // zero é válido (sobrou nada)
  });

  it("rejeita quantidade negativa", () => {
    const r = validateQuantity("-1");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/negativa/);
    expect(validateQuantity(-0.5).ok).toBe(false);
  });

  it("rejeita vazio e texto não numérico", () => {
    expect(validateQuantity("").ok).toBe(false);
    expect(validateQuantity("abc").ok).toBe(false);
  });

  it("rejeita Infinity", () => {
    expect(validateQuantity(Infinity).ok).toBe(false);
  });
});

describe("parseQuantity", () => {
  it("converte vírgula decimal", () => {
    expect(parseQuantity("1,5")).toBe(1.5);
    expect(parseQuantity("2")).toBe(2);
  });
});

describe("validateItemName", () => {
  it("exige nome não vazio", () => {
    expect(validateItemName("").ok).toBe(false);
    expect(validateItemName("   ").ok).toBe(false);
    expect(validateItemName("Arroz").ok).toBe(true);
  });

  it("limita o tamanho", () => {
    expect(validateItemName("a".repeat(81)).ok).toBe(false);
    expect(validateItemName("a".repeat(80)).ok).toBe(true);
  });
});

describe("validateUnit", () => {
  it("unidade é obrigatória", () => {
    expect(validateUnit("").ok).toBe(false);
    expect(validateUnit("  ").ok).toBe(false);
    expect(validateUnit("kg").ok).toBe(true);
  });
});

describe("validateInviteCode", () => {
  it("aceita 6 caracteres alfanuméricos", () => {
    expect(validateInviteCode("ABC123").ok).toBe(true);
    expect(validateInviteCode(" abc123 ").ok).toBe(true);
  });

  it("rejeita tamanho errado ou símbolos", () => {
    expect(validateInviteCode("AB").ok).toBe(false);
    expect(validateInviteCode("ABCDEFG").ok).toBe(false);
    expect(validateInviteCode("ABC12!").ok).toBe(false);
    expect(validateInviteCode("").ok).toBe(false);
  });
});
