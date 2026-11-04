---
name: Poupensa
description: Quem pensa na despensa, poupa. Lista de mercado mensal corrigida pelo consumo real da casa.
colors:
  primary: "#188345"
  primary-hover: "#146c39"
  primary-foreground: "#ffffff"
  brand-green: "#1f9d55"
  accent: "#8b5cf6"
  accent-hover: "#7c3aed"
  accent-foreground: "#ffffff"
  accent-tint: "rgb(139 92 246 / 0.1)"
  background: "#fafaf9"
  foreground: "#1c1917"
  card: "#ffffff"
  muted: "#f5f5f4"
  muted-foreground: "#78716c"
  border: "#e7e5e4"
  destructive: "#dc2626"
  destructive-tint: "rgb(220 38 38 / 0.1)"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "44px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  list-name:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(30px, 9.7vw, 56px)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  quantity:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "clamp(30px, 9.7vw, 56px)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.04em"
  struck:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(20px, 6.2vw, 28px)"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  page-title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.33
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.375
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.43
  caption:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.33
rounded:
  chip: "6px"
  cta: "10px"
  lg: "16px"
  xl: "22.4px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  page-app: "16px"
  page-landing: "20px"
  page-landing-md: "40px"
  page-landing-xl: "56px"
  section: "56px"
  section-lg: "112px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-primary-action:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    height: "48px"
    width: "100%"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "44px"
  button-outline-hover:
    backgroundColor: "{colors.muted}"
  button-destructive:
    backgroundColor: "{colors.destructive-tint}"
    textColor: "{colors.destructive}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "44px"
  landing-cta:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.cta}"
    padding: "0 32px"
    height: "54px"
  landing-cta-hover:
    backgroundColor: "{colors.primary-hover}"
  landing-cta-inverse:
    backgroundColor: "{colors.card}"
    textColor: "{colors.primary}"
    rounded: "{rounded.cta}"
    padding: "0 40px"
    height: "54px"
  input:
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "4px 10px"
    height: "44px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "16px"
  card-compact:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "12px"
  badge-suggestion:
    backgroundColor: "{colors.accent-tint}"
    textColor: "{colors.accent-hover}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
    height: "20px"
  badge-neutral:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
    height: "20px"
  badge-missing:
    backgroundColor: "{colors.destructive-tint}"
    textColor: "{colors.destructive}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
    height: "20px"
  chip-example:
    textColor: "{colors.muted-foreground}"
    typography: "{typography.caption}"
    rounded: "{rounded.chip}"
    padding: "2px 8px"
  nav-item:
    backgroundColor: "{colors.card}"
    textColor: "{colors.muted-foreground}"
    height: "56px"
  nav-item-active:
    backgroundColor: "{colors.card}"
    textColor: "{colors.primary}"
    height: "56px"
  list-guess:
    textColor: "{colors.muted-foreground}"
    typography: "{typography.struck}"
  list-quantity:
    textColor: "{colors.accent-hover}"
    typography: "{typography.quantity}"
---

# Design System: Poupensa

## Overview

**Creative North Star: "A Lista Reescrita"**

O Poupensa é uma lista de mercado que se corrige: o que a casa achava cede lugar ao que a conta mostra. O sistema inteiro serve a essa leitura. Papel off-white quente, tinta quase preta, fios finos no lugar de caixas pesadas, verde para agir e lilás para o que o app calculou. A tipografia é só Geist e Geist Mono, sem ornamento, e a força vem da escala e do contraste entre nome e quantidade.

O mesmo mundo fala em dois registros. A landing persuade: palavras muito grandes, densidade baixa, fios como estrutura de toda a página. O app trabalha: coluna estreita de celular, cards de cantos generosos, quantidades em linhas curtas, tudo operável com uma mão e com pressa. Os tokens de cor, família e sombra são os mesmos nos dois; mudam a escala e a contenção.

Light mode apenas, mobile-first. A superfície fica chapada e calma, sem gradiente visível nem sombra pesada, para que o lilás seja lido como informação e não como decoração.

**Key Characteristics:**

- Off-white quente com tinta de stone, nunca branco puro como fundo de página.
- Verde agir, lilás calculado: duas vozes de cor com papéis que não se trocam.
- Fios de 1px e tons de superfície fazem a estrutura; a sombra quase não aparece.
- Geist em peso alto e tracking negativo; Geist Mono onde a quantidade é o assunto.
- Ícones Lucide, alvos de toque de pelo menos 44px, foco sempre visível.

## Colors

Neutros stone levemente quentes sustentam duas cores de papel fixo: verde para ação e lilás para o que o app produz.

### Primary

- **Verde Ação** (#188345): botões primários, links, item ativo da navegação, palavra "pensa" do logo e o bloco final da landing. É o verde de uso em texto e fundo, porque branco sobre ele dá 4.80:1.
- **Verde Ação Fundo** (#146c39): hover do verde em botões e links.
- **Verde da Marca** (#1f9d55): cor de marca para `theme-color` do navegador e demais usos não textuais. Branco sobre ele dá 3.49:1, então não leva texto.

### Secondary

- **Lilás da Marca** (#8b5cf6): tile do logo, ícones de estado vazio, ícone do convite e borda do botão de voz ouvindo. Contra branco dá 4.23:1, então fica em ícones e superfícies, não em texto corrido.
- **Lilás Calculado** (#7c3aed): toda sugestão e quantidade calculada em texto, a frase final de "Dois registros por mês", ícones de recursos da landing e o controle da demo. Dá 5.46:1 contra o fundo.
- **Véu Lilás** (10% do Lilás da Marca): fundo do badge de sugestão e do botão de voz ouvindo. O painel de convite usa 5% com borda tracejada a 50%.

### Neutral

- **Papel** (#fafaf9): fundo de toda página e do app.
- **Tinta** (#1c1917): texto principal e fio grosso dos passos de registro na landing.
- **Branco de Superfície** (#ffffff): cards, diálogos, navegação inferior e as seções alternadas da landing.
- **Névoa** (#f5f5f4): badge neutro, hover de outline e ghost, aviso de rascunho nas páginas legais.
- **Tinta Lavada** (#78716c): texto secundário, chute riscado e "pode pular". Dá 4.59:1 sobre Papel e 4.80:1 sobre branco, mas só 4.40:1 sobre Névoa.
- **Fio** (#e7e5e4): divisores, bordas de input e estrutura das listas.

### Estado

- **Falta** (#dc2626): mensagens de erro, ação destrutiva e badge "em falta", com fundo a 10% quando é superfície.

### Named Rules

**The Lilac Is The App Rule.** Lilás marca o que o app produziu ou a própria marca: sugestão calculada, código de convite gerado, escuta de voz, ícones de destaque. Dado digitado pelo casal nunca é lilás; assim que a quantidade é editada, o badge lilás sai de cena.

**The AA Green Rule.** Texto sobre verde, e verde como texto, usa sempre o Verde Ação. O Verde da Marca não leva texto.

## Typography

**Display Font:** Geist (com ui-sans-serif, system-ui)
**Body Font:** Geist (com ui-sans-serif, system-ui)
**Label/Mono Font:** Geist Mono (com ui-monospace)

**Character:** Uma única família trabalha em todas as escalas, e o peso e o tracking negativo dão presença aos títulos. A Geist Mono entra como a voz da conta: números que se leem como resultado.

### Hierarchy

- **Display** (700, 44px no mobile, clamp(56px, 5.5vw, 84px) no desktop, entrelinha 1): H1 da landing. O bloco final vai a 88px e o título de Problema, a 72px.
- **Headline** (700, 32px no mobile, 56px no desktop, entrelinha 1.08): títulos de seção da landing, com `text-balance`.
- **List Name / Quantity** (600 e 500 em Mono, clamp(30px, 9.7vw, 56px), chegando a clamp(56px, 4.7vw, 76px) no desktop): nome do item e quantidade na lista reescrita. Mesmo tamanho nos dois lados da linha, de propósito.
- **Struck** (400, clamp(20px, 6.2vw, 28px)): chute riscado acima ou à esquerda do item.
- **Page Title** (700, 24px): título de tela no app, seguido de descrição em 14px.
- **Title** (500, 16px): título de card e nome de item no app.
- **Body** (400, 16px, entrelinha 1.5): texto corrido, entre 42 e 65ch na landing e 16 a 18px em blocos de leitura.
- **Label** (500, 14px): botões, rótulos e metadados.
- **Caption** (400, 12px): selo "Exemplo", badges, erros de campo e notas. É o piso de tamanho.

### Named Rules

**The Struck Guess Rule.** O risco significa "este valor foi substituído" e sempre vem com o valor que o substitui. É traçado por uma linha de `max(1.5px, 0.065em)` a 58% da altura, cai para `line-through` em `forced-colors`, e aparece pintado mesmo sem animação.

**The Tight Mono Rule.** Na Geist Mono com unidade, aplique `word-spacing: -0.3em` e tracking entre -0.03em e -0.04em: o espaço nativo da fonte separa demais número e unidade. A exceção são códigos de convite, em que o espaçamento largo (0.3em ou `tracking-widest`) ajuda a ditar o código em voz alta.

## Layout

**Landing.** Contêiner de até 1440px com margem de 20px, 40px a partir de `md` e 56px a partir de `xl`. Seções respiram 56px no mobile e 112px no desktop, e o bloco final chega a 128px. A estrutura é feita de linhas de lista de largura total, em grades de 12 colunas ou `1fr 1.25fr 1fr`, nunca fileiras de cards iguais. Em celulares com altura até 720px, o texto de apoio do hero desce para depois da oferta, para manter o CTA na dobra.

**App.** Coluna única de até 512px centrada, margem de 16px, gap de 16px entre blocos e de 8px entre itens de lista. A navegação inferior é fixa, respeita `safe-area-inset-bottom`, e o conteúdo reserva 96px abaixo. Páginas legais usam coluna de até 672px.

**Ritmo.** A escala parte de 4px: 4, 8, 12, 16, 24, 32, 48, 56. A troca principal de layout acontece em `lg` (1024px); no app não há mudança de layout por largura.

## Elevation & Depth

O sistema é chapado. A profundidade vem da troca entre Papel e Branco de Superfície, de fios de 1px e, nos cards e diálogos, de um anel de tinta a 10%. A sombra aparece apenas no que flutua ou pode ser agarrado, sempre com alfa baixo. Diálogos usam um véu preto a 10% com desfoque leve.

### Shadow Vocabulary

- **Polegar** (`box-shadow: 0 2px 8px rgba(28, 25, 23, 0.08)`): polegar do controle da demo, único consumidor direto do token `--shadow-md` do projeto.
- **Menu** (`box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`): menu do select.
- **Flutuante** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`): banner de instalação do PWA, o teto da escala.

### Named Rules

**The Hairline Structure Rule.** Na landing, a separação entre conteúdos é um fio, não uma caixa. Fio de 2px em Tinta só para o que o casal registra; o que o app calcula fica no fio claro.

**The Flat Surface Rule.** Card em repouso não tem sombra. Se uma superfície parece precisar de uma, antes tente o anel de 10% ou a troca de tom.

## Shapes

Cantos arredondados e generosos no app e mais contidos na landing, sobre retângulos simples.

- **Selo** (6px): selo "Exemplo".
- **CTA** (10px): botões e foco do logo na landing.
- **Controle** (16px): botões, inputs e aviso de rascunho no app, além de ser o valor-base de `--radius`.
- **Superfície** (22.4px): cards, diálogos e painel de convite. O banner do PWA chega a 28.8px.
- **Pílula** (totalmente arredondado): badges, trilho e polegar do controle.
- **Tile do logo:** 22.4px sobre 36px, lido como círculo.

Checkbox fica em 4px. Linhas de lista na landing não têm canto: são só fios.

## Components

### Buttons

Chapados e diretos, com leve afundamento ao pressionar (1px).

- **Shape:** cantos de 16px no app e 10px na landing.
- **Primary:** Verde Ação com texto branco, em 14px peso 500 e 44px de altura; a ação final de um fluxo vai a 48px, largura total, 16px.
- **Landing CTA:** 54px de altura no mobile e 60px no desktop, padding de 32 a 48px, 17 a 18px peso 600. O CTA do cabeçalho usa 44px.
- **Landing CTA invertido:** Branco de Superfície com texto Verde Ação, sobre o bloco final verde; no hover, o texto vai para o Verde Ação Fundo.
- **Hover / Focus:** hover para o Verde Ação Fundo. Foco no app com anel de 3px em verde a 50% e borda sólida; na landing com contorno de 2px e afastamento de 2px.
- **Secondary / Ghost / Destructive:** outline sobre Papel com fio; ghost só ganha fundo Névoa no hover; destrutivo é texto Falta sobre véu de 10%.
- **Altura:** os tamanhos padrão do shadcn (32 a 36px) são sempre sobrescritos para 44px ou mais.

### Badges e selos

- **Sugestão:** pílula de 20px com Véu Lilás e texto Lilás Calculado, com ícone Lucide de 12px, quantidade e base do cálculo.
- **Neutro:** pílula em Névoa, usada quando não há sugestão ou o valor foi editado.
- **Em falta:** pílula com véu e texto Falta.
- **Selo "Exemplo":** contorno de 1px em Fio, Tinta Lavada, 12px. Acompanha todo dado de demonstração.

### Cards / Containers

- **Corner Style:** 22.4px.
- **Background:** Branco de Superfície sobre Papel.
- **Shadow Strategy:** sem sombra; anel de tinta a 10%.
- **Border:** só o anel.
- **Internal Padding:** 16px, ou 12px na variante compacta usada em listas. Item excluído da lista fica a 60% de opacidade.
- **Estado vazio:** card centrado, com ícone Lucide de 32px em Lilás da Marca, título 500 e apoio em 14px.

### Inputs / Fields

- **Style:** fundo transparente, fio de 1px, cantos de 16px, 44px de altura, texto de 16px para não disparar zoom no iOS.
- **Quantidade:** unidade em 14px Tinta Lavada, ancorada à direita dentro do campo, e botão de voz de 44px ao lado.
- **Focus:** borda verde com anel de 3px a 50%.
- **Error / Disabled:** borda Falta com anel a 20% e mensagem de 12 a 14px logo abaixo; desabilitado a 50%.

### Navigation

- **App:** barra inferior fixa em Branco de Superfície com fio superior e cinco destinos de pelo menos 56px, ícone de 20px sobre rótulo. Ativo em Verde Ação, inativo em Tinta Lavada, sem pílula nem indicador extra.
- **Landing:** logo à esquerda, links de 44px de altura mínima à direita, sublinhado no hover com afastamento de 4px. No mobile restam logo e "Já tenho conta".

### Logo

Tile de 36px em Lilás da Marca com a folha Lucide em branco, seguido de "Pou" em Tinta e "pensa" em Verde Ação, 24px peso 700. É o único lugar em que as duas cores se encontram.

### Lista Reescrita (assinatura da landing)

Linha entre fios: chute riscado em Tinta Lavada, nome em List Name, quantidade alinhada à direita em Geist Mono Lilás Calculado, ou "pode pular" menor em Tinta Lavada quando não há o que comprar. O risco é traçado uma vez ao entrar (800ms, `cubic-bezier(0.16, 1, 0.3, 1)`, com atrasos de 200, 420 e 640ms) e respeita `prefers-reduced-motion`.

### Demonstração do cálculo

A mesma linha, agora com controle "quanto sobrou?": trilho de 4px em Fio, faixa e borda do polegar em Lilás Calculado, polegar de 24px com área de toque de 48px e sombra Polegar. A cada troca, o valor anterior é riscado em 240ms e o resultado fica em região `aria-live`, com altura reservada para não deslocar o conteúdo abaixo.

## Do's and Don'ts

### Do:

- **Do** usar lilás em tudo que o app calculou, e Lilás Calculado (#7c3aed) quando o lilás for texto.
- **Do** usar Verde Ação (#188345) em CTAs, links e texto sobre verde.
- **Do** manter todo alvo de toque em 44×44px ou mais, sobrescrevendo os tamanhos padrão do shadcn.
- **Do** marcar dado de demonstração com o selo "Exemplo".
- **Do** riscar um valor somente quando há outro valor substituindo-o.
- **Do** condicionar animação a `prefers-reduced-motion`, deixando o estado final visível sem ela.
- **Do** usar ícones Lucide, com `aria-hidden` quando acompanham texto.
- **Do** usar cards no app e fios na landing; são dois registros do mesmo mundo.

### Don't:

- **Don't** colocar texto sobre o Verde da Marca (#1f9d55) nem texto em Lilás da Marca (#8b5cf6) sobre branco; ficam abaixo de 4.5:1.
- **Don't** pintar de lilás um dado que o casal digitou.
- **Don't** usar gradiente visível. O risco é pintado com `linear-gradient(currentColor, currentColor)`, que resulta em cor chapada e é técnica permitida.
- **Don't** passar da sombra Flutuante, nem colocar sombra em card em repouso.
- **Don't** usar emoji como ícone estrutural.
- **Don't** introduzir dark mode: as classes `dark:` do shadcn não têm paleta por trás.
- **Don't** usar texto menor que 12px.
- **Don't** colocar Tinta Lavada sobre Névoa em texto pequeno (4.40:1); use Tinta.
