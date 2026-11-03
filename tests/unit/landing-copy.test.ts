import { describe, expect, it } from "vitest";
import { demoIntro, demoResult, demoSliderValue, heroList } from "@/components/landing/copy";
import { nextPurchase } from "@/lib/landing-example";

describe("demo da landing", () => {
  it("descreve a compra de exemplo", () => {
    expect(demoIntro(5, 30)).toBe("5 kg de arroz comprados há 30 dias");
    expect(demoSliderValue(2)).toBe("2 kg");
  });

  it("mostra uso, sobra e próxima compra quando ainda tem", () => {
    const result = demoResult(5, 1, 3);
    expect(result.lead).toBe("Vocês usaram 4 kg e ainda têm 1 kg.");
    expect(result.suggestion).toBe("Próxima compra: 3 kg");
    expect(result.shortQuantity).toBe("3 kg");
    expect(result.text).toBe("Vocês usaram 4 kg e ainda têm 1 kg. Próxima compra: 3 kg.");
  });

  it("diz que acabou antes da hora quando sobrou zero", () => {
    expect(demoResult(5, 0, 6).lead).toBe("Acabou antes da hora.");
  });

  it("sugere pular quando a próxima compra é zero", () => {
    const result = demoResult(5, 5, 0);
    expect(result.suggestion).toBeNull();
    expect(result.shortQuantity).toBe(heroList.skipLabel);
    expect(result.text).toBe("Neste mês, pode pular o arroz.");
  });

  it("usa o mesmo cálculo do app para os números exibidos", () => {
    expect(nextPurchase(5, 1)).toBe(3);
    expect(nextPurchase(5, 0)).toBe(6);
  });
});
