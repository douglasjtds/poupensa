# Poupensa - Design Guidelines

> Referências: Linear, Resend, Vercel. Light mode, clean, moderno. Base: shadcn/ui.

---

## Paleta de Cores

Verde (economia, ação) + lilás/roxo (identidade, foge do clichê bancário).

### Cores Primárias

| Token | Hex | Uso |
|-------|-----|-----|
| `primary` (verde) | `#1F9D55` | CTAs primários, ações de confirmação, "economia realizada" |
| `primary-hover` | `#188345` | Estado hover/active do primário |
| `accent` (lilás) | `#8B5CF6` | Elementos de marca, ícones de destaque, badges |
| `accent-hover` | `#7C3AED` | Estado hover/active do accent |

### Cores Neutras / Base

| Token | Hex | Uso |
|-------|-----|-----|
| `background` | `#FAFAF9` | Fundo geral (off-white, não branco puro) |
| `surface` | `#FFFFFF` | Cards, painéis |
| `border` | `#E7E5E4` | Divisores, bordas de input |
| `text-primary` | `#1C1917` | Texto principal |
| `text-secondary` | `#78716C` | Texto secundário, labels, helper text |

### Cores de Estado

| Token | Hex | Uso |
|-------|-----|-----|
| `success` | `#1F9D55` | Reaproveita o verde primário — "quantidade suficiente" |
| `warning` | `#D97706` | "Quantidade no limite" / atenção |
| `danger` | `#DC2626` | "Item em falta" / ação destrutiva |

**Nota de acessibilidade:** todas as combinações texto/fundo acima atendem contraste mínimo de 4.5:1 (WCAG AA) para texto normal. Ao usar `primary` ou `accent` como fundo de botão, o texto deve ser branco (`#FFFFFF`), não `text-primary`.

---

## Tipografia

| Uso | Font | Peso |
|-----|------|------|
| Headings | Geist ou Inter | 600-700 |
| Body | Geist ou Inter | 400-500 |
| Números/quantidades (destaque) | Geist Mono (opcional) | 500 |

- Base: 16px, line-height 1.5
- Escala sugerida: 12 / 14 / 16 / 20 / 24 / 32 / 40px
- Nunca usar corpo de texto abaixo de 12px

---

## Espaçamento

Sistema baseado em 4px/8px:

```
4, 8, 12, 16, 24, 32, 48, 64
```

- Padding interno de cards: 16-24px
- Gap entre elementos de lista: 8-12px
- Espaçamento entre seções: 32-48px

---

## Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `radius-sm` | 6px | Inputs, botões pequenos |
| `radius-md` | 10px | Cards, botões padrão |
| `radius-lg` | 16px | Modais, painéis grandes |

---

## Sombras

Sutis, evitando sombras pesadas (estilo Linear/Vercel):

```css
--shadow-sm: 0 1px 2px rgba(28, 25, 23, 0.04);
--shadow-md: 0 2px 8px rgba(28, 25, 23, 0.08);
--shadow-lg: 0 8px 24px rgba(28, 25, 23, 0.12);
```

---

## Uso de Componentes shadcn/ui

| Tela/Fluxo | Componentes shadcn |
|------------|---------------------|
| Cadastro de item | `Input`, `Select` (unidade), `Button` |
| Registro de compra | `Card` por item, `Input` numérico, `Button` (confirmar) |
| Conferência pré-compra | `Card`, `Slider` ou `Input` numérico, `Progress` (opcional, visual de "quanto sobrou") |
| Lista de compras gerada | `Checkbox` por item, `Badge` (quantidade sugerida), `Button` (finalizar) |
| Despensa compartilhada | `Avatar` (indicando quem registrou), `Tabs` (Despensa / Histórico) |
| Input por voz | `Button` com ícone de microfone (estado ativo com `accent`), feedback visual de "ouvindo" |

---

## Diretrizes de Interação (mobile-first)

- Touch targets mínimo 44×44px (uso no mercado, muitas vezes com pressa ou uma mão ocupada)
- Feedback visual imediato ao registrar quantidade (sem esperar submit para confirmar)
- Estado de "sugestão calculada" deve usar o `accent` (lilás) para diferenciar de dado bruto inserido pelo usuário
- Ícones: usar biblioteca vetorial (ex: Lucide, já disponível via shadcn/ui) — nunca emoji como ícone estrutural
- Dark mode fora do escopo do MVP (confirmado em MVP-SCOPE.md)

---

## Referências Visuais

- [linear.app](https://linear.app) — hierarquia visual, hover states
- [resend.com](https://resend.com) — clareza tipográfica
- [vercel.com](https://vercel.com) — uso de espaço em branco e contraste sutil
