"use client";

import { useId, useState } from "react";
import { Slider } from "@/components/ui/slider";
import {
  demoIntro,
  demoResult,
  demoSliderValue,
  demoStatic,
  heroList,
} from "@/components/landing/copy";
import { nextPurchase } from "@/lib/landing-example";
import { cn } from "@/lib/utils";

const INITIAL_LEFT_KG = 1;
const SLIDER_FORMAT: Intl.NumberFormatOptions = { style: "unit", unit: "kilogram" };
/** O chute do arroz, o mesmo da lista do hero, é o primeiro valor riscado. */
const INITIAL_GUESS = heroList.items[0].guess;

// Mesma anatomia e escala das linhas da lista do hero (landing.tsx).
const STRUCK_CLASS =
  "text-[clamp(20px,6.2vw,28px)] leading-tight tracking-[-0.02em] text-muted-foreground";
const NAME_CLASS =
  "text-[clamp(30px,9.7vw,56px)] leading-[1.15] font-semibold tracking-[-0.03em] lg:text-[clamp(56px,4.7vw,76px)]";
const QUANTITY_CLASS =
  "text-right font-mono whitespace-nowrap text-[clamp(30px,9.7vw,56px)] leading-[1.15] font-medium tracking-[-0.04em] [word-spacing:-0.3em] text-accent-hover lg:text-[clamp(56px,4.7vw,76px)]";
const SKIP_CLASS =
  "text-right font-mono whitespace-nowrap text-[clamp(15px,5vw,32px)] font-medium tracking-[-0.03em] [word-spacing:-0.3em] text-muted-foreground lg:text-[clamp(32px,2.8vw,44px)]";

function resultFor(leftKg: number) {
  const nextKg = nextPurchase(demoStatic.boughtKg, leftKg, demoStatic.daysAgo);
  return demoResult(demoStatic.boughtKg, leftKg, nextKg);
}

// Estado da demo: o que sobrou e o último valor substituído; o resto deriva do
// cálculo real. `struck` nulo significa que ainda vale o chute inicial.
function useCheckDemo() {
  const [state, setState] = useState<{ leftKg: number; struck: string | null }>({
    leftKg: INITIAL_LEFT_KG,
    struck: null,
  });
  const result = resultFor(state.leftKg);

  // Update funcional: dois eventos antes de um render (arrasto rápido) comparam
  // cada um com o valor anterior real, não com o do último render.
  function changeLeft(nextLeftKg: number) {
    setState((prev) => {
      if (nextLeftKg === prev.leftKg) return prev;
      const before = resultFor(prev.leftKg).shortQuantity;
      // Entre dois "pode pular" nada foi reescrito: o riscado continua o mesmo.
      const struck = resultFor(nextLeftKg).shortQuantity !== before ? before : prev.struck;
      return { leftKg: nextLeftKg, struck };
    });
  }

  return { leftKg: state.leftKg, changeLeft, result, struck: state.struck };
}

/** Destaca as quantidades de uma frase em fonte mono, sem alterar o texto. */
function MonoQuantities({ text }: { text: string }) {
  return text.split(/(\d+(?:,\d+)?\skg)/).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="font-mono">
        {part}
      </span>
    ) : (
      part
    )
  );
}

// Demonstração "quanto sobrou?": é a própria linha do arroz. Mexer no controle
// reescreve a quantidade com a mesma função que o app usa, e o valor anterior
// fica riscado acima dela.
export function CheckDemo({ className }: { className?: string }) {
  const { leftKg, changeLeft, result, struck } = useCheckDemo();
  const labelId = useId();

  return (
    <div data-slot="check-demo" className={cn("flex flex-col", className)}>
      <div data-slot="check-demo-title" className="flex items-center justify-between gap-3 pb-2">
        <p className="text-sm font-semibold lg:text-base">
          <MonoQuantities text={demoIntro(demoStatic.boughtKg, demoStatic.daysAgo)} />
        </p>
        <span data-slot="check-demo-example" className="lp-chip">
          {demoStatic.exampleLabel}
        </span>
      </div>

      {/* A frase completa está na região live; aqui os valores são só visuais. */}
      <div data-slot="check-demo-line" className="border-y border-border py-2">
        <p data-slot="check-demo-struck" aria-hidden className={STRUCK_CLASS}>
          {/* A key refaz o traçado a cada troca; a animação respeita reduced-motion no CSS. */}
          <s key={struck} className={cn("lp-strike", struck && "lp-strike-draw font-mono")}>
            {struck ?? INITIAL_GUESS}
          </s>
        </p>
        <p className="flex items-baseline justify-between gap-2">
          <span data-slot="check-demo-name" className={NAME_CLASS}>
            {demoStatic.itemName}
          </span>
          <span
            data-slot="check-demo-quantity"
            aria-hidden
            className={result.suggestion ? QUANTITY_CLASS : SKIP_CLASS}
          >
            {result.shortQuantity}
          </span>
        </p>
      </div>

      <div data-slot="check-demo-control" className="flex flex-col gap-1 py-4">
        <div className="flex items-baseline justify-between gap-3">
          <span id={labelId} data-slot="check-demo-label" className="text-base/5 font-medium">
            {demoStatic.control}
          </span>
          <span data-slot="check-demo-left" className="font-mono text-xl/5 font-medium">
            {demoSliderValue(leftKg)}
          </span>
        </div>
        {/* Alvo de toque ≥ 44px: altura do Control e área do Thumb (22 + 2 × 12). */}
        {/* format + locale geram o aria-valuetext do Thumb ("1 kg"), sem tocar no DOM. */}
        <Slider
          aria-labelledby={labelId}
          format={SLIDER_FORMAT}
          locale="pt-BR"
          min={0}
          max={5}
          step={1}
          value={[leftKg]}
          onValueChange={(value) => changeLeft(Array.isArray(value) ? value[0] : (value as number))}
          className="[&_[data-slot=slider-thumb]]:size-6 [&_[data-slot=slider-thumb]]:after:-inset-3 [&>div]:min-h-11"
        />
      </div>

      {/* O conteúdo desta região é exatamente result.text; o lilás é só visual. */}
      <p
        data-slot="check-demo-result"
        aria-live="polite"
        aria-atomic="true"
        className="font-medium"
      >
        <MonoQuantities text={result.lead} />
        {result.suggestion && (
          <>
            {" "}
            <span data-slot="check-demo-suggestion" className="text-accent-hover">
              <MonoQuantities text={result.suggestion} />.
            </span>
          </>
        )}
      </p>

      <p data-slot="check-demo-note" className="text-xs text-muted-foreground">
        {demoStatic.note}
      </p>
    </div>
  );
}
