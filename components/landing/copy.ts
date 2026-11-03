/**
 * Copy da landing page do Poupensa (pt-BR).
 * Sem React. Quantidades calculadas nunca aparecem como texto
 * fixo: a lista do hero e a demo expõem números de compra e sobra, e quem
 * renderiza calcula a sugestão com `calculateSuggestion`.
 */

import { formatDecimal, type Unit } from "@/lib/format";

export { formatQuantity, type Unit } from "@/lib/format";

// ---------- Tipos ----------

export interface HeaderCopy {
  logoLabel: string;
  howItWorks: string;
  login: string;
  cta: string;
}

export interface HeroListItem {
  name: string;
  /** O chute do casal, em voz coloquial. Aparece riscado. */
  guess: string;
  /** Quantidade comprada, em número. */
  bought: number;
  /** Quantidade que sobrou, em número. */
  left: number;
  unit: Unit;
}

export interface HeroCopy {
  h1: string;
  sub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  /** Apoio da oferta, perto dos CTAs. */
  offer: string;
  /** Texto curto para selo ou badge. */
  offerBadge: string;
}

export interface HeroListCopy {
  /** Identificação visível da lista como exemplo. */
  exampleLabel: string;
  title: string;
  note: string;
  labels: { bought: string; left: string; next: string };
  /** Texto exibido quando a próxima compra calculada é zero. */
  skipLabel: string;
  items: readonly HeroListItem[];
}

export interface ProblemItem {
  /** O chute, riscado acima da situação. */
  guess: string;
  text: string;
}

export interface ProblemCopy {
  title: string;
  items: readonly ProblemItem[];
}

export interface SolutionCopy {
  title: string;
  body: string;
  origin: string;
}

export interface StepExample {
  /** Rótulo curto, ex.: "Compraram". */
  label: string;
  /** Número do exemplo. Nulo quando o resultado deve ser calculado por quem renderiza. */
  value: number | null;
  unit: Unit;
}

export interface Step {
  title: string;
  text: string;
  /** Mini-exemplo de dados com o arroz do hero. */
  example: StepExample;
}

export interface HowItWorksCopy {
  title: string;
  steps: readonly Step[];
  support: string;
}

export type FeatureId = "shared-pantry" | "auto-calc" | "voice" | "list-control" | "depletion";

export interface Feature {
  /** Chave estável para o ícone e a key do React; não aparece na tela. */
  id: FeatureId;
  title: string;
  text: string;
}

export interface FeaturesCopy {
  title: string;
  items: readonly Feature[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCopy {
  title: string;
  items: readonly FaqItem[];
}

export interface FinalCtaCopy {
  title: string;
  cta: string;
  support: string;
}

export interface FooterCopy {
  howItWorks: string;
  privacy: string;
  terms: string;
  copyright: string;
}

// ---------- Seções ----------

export const header: HeaderCopy = {
  logoLabel: "Poupensa",
  howItWorks: "Como funciona",
  login: "Já tenho conta",
  cta: "Começar grátis",
};

export const hero: HeroCopy = {
  h1: "Quem pensa na despensa, poupa.",
  sub: "Registrem a compra do mês, confiram o que sobrou antes da próxima e recebam a lista com a quantidade certa de cada item, calculada pelo consumo da casa de vocês.",
  ctaPrimary: "Começar grátis",
  ctaSecondary: "Ver como funciona",
  offer: "3 meses grátis, sem cartão. O app está em fase de testes.",
  offerBadge: "3 meses grátis",
};

export const heroList: HeroListCopy = {
  exampleLabel: "Exemplo",
  title: "Lista de compras do mês",
  note: "Dados de exemplo, só para mostrar a conta.",
  labels: { bought: "Compraram", left: "Sobrou", next: "Próxima compra" },
  skipLabel: "pode pular",
  items: [
    {
      name: "Arroz",
      guess: "arroz, uns 5 kg?",
      bought: 5,
      left: 1,
      unit: { singular: "kg", plural: "kg" },
    },
    {
      name: "Café",
      guess: "café, sei lá",
      bought: 4,
      left: 1,
      unit: { singular: "pacote", plural: "pacotes" },
    },
    {
      name: "Sabão em pó",
      guess: "sabão, ainda tem?",
      bought: 2,
      left: 1,
      unit: { singular: "caixa", plural: "caixas" },
    },
  ],
};

const [riceItem, coffeeItem, soapItem] = heroList.items;

export const problem: ProblemCopy = {
  title: "Na dúvida, vocês chutam. E o chute costuma sair errado.",
  items: [
    {
      guess: coffeeItem.guess,
      text: "O café acabou no dia 12, e lá vão vocês ao mercado de novo.",
    },
    {
      guess: riceItem.guess,
      text: "Tem arroz para três meses no armário, e mesmo assim entrou mais um pacote no carrinho.",
    },
    {
      guess: soapItem.guess,
      text: "No corredor do mercado, um acha que ainda tem sabão em pó. O outro acha que não.",
    },
  ],
};

export const solution: SolutionCopy = {
  title: "O Poupensa compara o que vocês compraram com o que sobrou.",
  body: "Essa diferença é o consumo real da casa. Com ela, o app sugere quanto comprar de cada item no próximo ciclo: mais dos que acabaram cedo, menos dos que sobraram.",
  origin: "O Poupensa nasceu da rotina de um casal, que usa o app na própria despensa.",
};

export const howItWorks: HowItWorksCopy = {
  title: "Dois registros por mês. A lista sai pronta.",
  steps: [
    {
      title: "Registrem a compra",
      text: "No dia da compra, anotem os itens e as quantidades.",
      example: { label: heroList.labels.bought, value: riceItem.bought, unit: riceItem.unit },
    },
    {
      title: "Confiram antes da próxima",
      text: "Para cada item, informem quanto sobrou.",
      example: { label: heroList.labels.left, value: riceItem.left, unit: riceItem.unit },
    },
    {
      title: "Recebam a lista pronta",
      text: "Revisem as quantidades, ajustem o que quiserem e vão às compras.",
      // Resultado de calculateSuggestion(bought, left), calculado por quem renderiza.
      example: { label: heroList.labels.next, value: null, unit: riceItem.unit },
    },
  ],
  support: "Nada de anotar cada item que sai do armário.",
};

export const features: FeaturesCopy = {
  title: "O que vocês encontram no app",
  items: [
    {
      id: "shared-pantry",
      title: "Despensa compartilhada",
      text: "Vocês dois veem e editam a mesma despensa, cada um no seu celular.",
    },
    {
      id: "auto-calc",
      title: "Cálculo automático",
      text: "A sugestão vem do consumo de cada item na casa de vocês, não de uma média genérica.",
    },
    {
      id: "voice",
      title: "Fale em vez de digitar",
      text: "Com as mãos ocupadas, ditem itens e quantidades e confiram antes de salvar. Funciona nos navegadores com reconhecimento de voz.",
    },
    {
      id: "list-control",
      title: "Lista que vocês controlam",
      text: "Marquem, desmarquem e ajustem as quantidades antes de finalizar.",
    },
    {
      id: "depletion",
      title: "Acabou antes da hora?",
      text: "Se quiserem, registrem o dia em que o item acabou, e o cálculo fica mais preciso.",
    },
  ],
};

export const faq: FaqCopy = {
  title: "Perguntas frequentes",
  items: [
    {
      question: "Preciso registrar toda vez que um item acabar?",
      answer:
        "Não. Bastam a compra e a conferência. Marcar que um item acabou é opcional e deixa o cálculo mais preciso.",
    },
    {
      question: "Funciona se a compra não for sempre no mesmo dia do mês?",
      answer:
        "Sim. O cálculo usa as datas registradas e o tempo real entre a compra e a conferência.",
    },
    {
      question: "Meu parceiro ou parceira também tem acesso?",
      answer:
        "Sim. Quem cria a despensa convida a outra pessoa, e os dois passam a ver e editar os mesmos dados.",
    },
    {
      question: 'O que significa "fase de testes"?',
      answer:
        "O Poupensa ainda está em construção. Telas e cálculos podem mudar, e pode aparecer alguma falha pelo caminho.",
    },
    {
      question: "O que acontece depois dos 3 meses grátis?",
      answer:
        "Hoje o app não cobra nada nem pede cartão. O plano é manter uma versão gratuita com limite de itens e criar um plano pago para a despensa completa. Nada será cobrado sem que vocês decidam assinar.",
    },
    {
      question: "Preciso instalar alguma coisa?",
      answer:
        "Não precisa de loja de aplicativos. O Poupensa abre no navegador, e dá para adicioná-lo à tela inicial do celular.",
    },
  ],
};

export const finalCta: FinalCtaCopy = {
  title: "Comecem na próxima compra grande.",
  cta: "Começar grátis",
  support: "3 meses grátis, sem cartão de crédito. O app está em fase de testes.",
};

export const footer: FooterCopy = {
  howItWorks: "Como funciona",
  privacy: "Privacidade",
  terms: "Termos",
  copyright: "© 2026 Poupensa",
};

// ---------- Demo: "Quanto sobrou?" ----------

export const demoStatic = {
  /** Compra de exemplo: 5 kg de arroz, há 30 dias. */
  boughtKg: 5,
  daysAgo: 30,
  itemName: "Arroz",
  exampleLabel: "Exemplo",
  control: "Quanto sobrou?",
  note: "Dados de exemplo. A conta é a mesma que o app faz com a despensa de vocês.",
} as const;

/** Ex.: "5 kg de arroz comprados há 30 dias". */
export function demoIntro(boughtKg: number, daysAgo: number): string {
  return `${formatDecimal(boughtKg)} kg de arroz comprados há ${daysAgo} dias`;
}

/** Valor anunciado pelo slider. Ex.: "2 kg". */
export function demoSliderValue(leftKg: number): string {
  return `${formatDecimal(leftKg)} kg`;
}

export interface DemoResult {
  /** Frase de abertura, em voz de casal. */
  lead: string;
  /** Próxima compra, em lilás. Nulo quando a sugestão é pular. */
  suggestion: string | null;
  /** Quantidade curta para a linha da demo: "3 kg", ou o skipLabel quando a sugestão é pular. */
  shortQuantity: string;
  /** Frase completa, para leitores de tela. */
  text: string;
}

/**
 * Texto do resultado da demo. `nextKg` vem de `calculateSuggestion`.
 * - sobrou 0: "Acabou antes da hora. Próxima compra: X kg."
 * - sobrou algo e a sugestão é maior que zero: "Vocês usaram X kg e ainda têm Z kg. Próxima compra: Y kg."
 * - sugestão zero: "Neste mês, pode pular o arroz."
 */
export function demoResult(boughtKg: number, leftKg: number, nextKg: number): DemoResult {
  if (nextKg <= 0) {
    const lead = "Neste mês, pode pular o arroz.";
    return { lead, suggestion: null, shortQuantity: heroList.skipLabel, text: lead };
  }
  const suggestion = `Próxima compra: ${formatDecimal(nextKg)} kg`;
  const lead =
    leftKg <= 0
      ? "Acabou antes da hora."
      : `Vocês usaram ${formatDecimal(Math.max(boughtKg - leftKg, 0))} kg e ainda têm ${formatDecimal(leftKg)} kg.`;
  return {
    lead,
    suggestion,
    shortQuantity: `${formatDecimal(nextKg)} kg`,
    text: `${lead} ${suggestion}.`,
  };
}
