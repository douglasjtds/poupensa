import { describe, expect, it } from "vitest";
import { formatDecimal, formatQuantity } from "@/lib/format";

describe("formatDecimal", () => {
  it("mantém inteiros sem casas", () => {
    expect(formatDecimal(5)).toBe("5");
    expect(formatDecimal(0)).toBe("0");
  });

  it("usa vírgula e corta em 2 casas sem zeros sobrando", () => {
    expect(formatDecimal(0.5)).toBe("0,5");
    expect(formatDecimal(1 / 3)).toBe("0,33");
    expect(formatDecimal(2.999)).toBe("3");
  });
});

describe("formatQuantity", () => {
  const box = { singular: "caixa", plural: "caixas" };

  it("usa o singular só para 1", () => {
    expect(formatQuantity(1, box)).toBe("1 caixa");
    expect(formatQuantity(2, box)).toBe("2 caixas");
    expect(formatQuantity(0.5, box)).toBe("0,5 caixas");
  });
});
