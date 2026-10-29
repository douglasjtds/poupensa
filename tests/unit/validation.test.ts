import { describe, expect, it } from "vitest";
import {
  parseQuantity,
  safeNextPath,
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

  it("trata ponto como separador de milhar do pt-BR", () => {
    expect(parseQuantity("1.000")).toBe(1000);
    expect(parseQuantity("12.500")).toBe(12500);
    expect(parseQuantity("1.000,5")).toBe(1000.5);
    expect(validateQuantity("1.000,5").ok).toBe(true);
  });

  it("mantém ponto decimal fora do padrão de milhar", () => {
    expect(parseQuantity("1.5")).toBe(1.5);
    expect(parseQuantity("0.25")).toBe(0.25);
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

describe("safeNextPath", () => {
  it("aceita caminhos relativos do app", () => {
    expect(safeNextPath("/lista")).toBe("/lista");
    expect(safeNextPath("/compra?x=1")).toBe("/compra?x=1");
  });

  it("cai no fallback sem next", () => {
    expect(safeNextPath(null)).toBe("/despensa");
    expect(safeNextPath("")).toBe("/despensa");
  });

  it("bloqueia destinos externos (open redirect)", () => {
    expect(safeNextPath("https://evil.com/x")).toBe("/despensa");
    expect(safeNextPath("@evil.com")).toBe("/despensa");
    expect(safeNextPath("//evil.com")).toBe("/despensa");
    expect(safeNextPath("/\\evil.com")).toBe("/despensa");
  });
});
