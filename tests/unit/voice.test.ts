import { describe, expect, it } from "vitest";
import { extractQuantity, formatQuantityForInput } from "@/lib/domain/voice";

describe("extractQuantity", () => {
  it("reconhece dígitos", () => {
    expect(extractQuantity("2")).toBe(2);
    expect(extractQuantity("sobraram 3 pacotes")).toBe(3);
  });

  it("reconhece decimais com vírgula e ponto", () => {
    expect(extractQuantity("1,5")).toBe(1.5);
    expect(extractQuantity("2.5 quilos")).toBe(2.5);
  });

  it("reconhece 'X e meio' com dígitos", () => {
    expect(extractQuantity("2 e meio")).toBe(2.5);
    expect(extractQuantity("1 e meia")).toBe(1.5);
  });

  it("reconhece números por extenso", () => {
    expect(extractQuantity("dois")).toBe(2);
    expect(extractQuantity("sobrou meio quilo")).toBe(0.5);
    expect(extractQuantity("dois e meio")).toBe(2.5);
    expect(extractQuantity("vinte e cinco")).toBe(25);
    expect(extractQuantity("zero")).toBe(0);
  });

  it("retorna null quando não há número", () => {
    expect(extractQuantity("acabou tudo ontem")).toBeNull();
    expect(extractQuantity("")).toBeNull();
  });
});

describe("formatQuantityForInput", () => {
  it("usa vírgula decimal", () => {
    expect(formatQuantityForInput(2.5)).toBe("2,5");
    expect(formatQuantityForInput(3)).toBe("3");
  });
});
