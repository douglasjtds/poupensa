// Anatomia da linha de item da landing (chute riscado, nome, quantidade ou
// "pode pular"). Compartilhada pela lista do hero, pelo Problem e pela demo,
// para a escala não divergir entre eles.

/** O chute riscado. */
export const STRUCK_CLASS =
  "text-[clamp(20px,6.2vw,28px)] leading-tight tracking-[-0.02em] text-muted-foreground";

/** Nome do item. */
export const NAME_CLASS =
  "text-[clamp(30px,9.7vw,56px)] leading-[1.15] font-semibold tracking-[-0.03em] lg:text-[clamp(56px,4.7vw,76px)]";

/** Quantidade sugerida, em lilás. */
export const QUANTITY_CLASS =
  "text-right font-mono whitespace-nowrap text-[clamp(30px,9.7vw,56px)] leading-[1.15] font-medium tracking-[-0.04em] [word-spacing:-0.3em] text-accent-hover lg:text-[clamp(56px,4.7vw,76px)]";

/** "pode pular", no lugar da quantidade. */
export const SKIP_CLASS =
  "text-right font-mono whitespace-nowrap text-[clamp(15px,5vw,32px)] font-medium tracking-[-0.03em] [word-spacing:-0.3em] text-muted-foreground lg:text-[clamp(32px,2.8vw,44px)]";
