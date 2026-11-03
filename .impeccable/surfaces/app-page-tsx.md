---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["components/landing"]
---

# Landing page

Modo: Persuade. Superfície inteira no mundo visual já existente do app.

## Público, ação e prova

- **Público:** aberto, chega sem conhecer o produto, muitas vezes pelo celular.
- **Ação:** cadastro em `/signup` por "Começar grátis".
- **Oferta:** 3 meses grátis, sem cartão, app em fase de testes.
- **Prova:** demonstração com o cálculo real e a origem em um casal que usa o app, sem nomes.
- **Evitar:** app financeiro sério, SaaS genérico, doméstico fofo, promessa de economia em reais ou porcentagem.

## Direction contract

THESIS: A página é uma lista de mercado sendo corrigida. Cada chute riscado ganha a quantidade certa em lilás. Recusa o hero com copy ao lado de um celular seguido de fileira de cards iguais.

OWN-WORLD: Fundo #FAFAF9, texto #1C1917, CTA #188345, sugestão calculada em lilás #7C3AED com quantidades em Geist Mono. Linhas de lista com fio #E7E5E4 como estrutura de toda a página, palavras grandes em Geist, chute em cinza riscado. Sem gradiente, sem sombra pesada e sem moldura de celular.

STORY: O visitante reconhece o próprio chute, entende que a quantidade vem de comprado menos sobrou, mexe no exemplo, vê que são dois registros por mês e se cadastra sabendo que é grátis por 3 meses e está em testes.

FIRST VIEWPORT: Logo à esquerda e "Já tenho conta" à direita. Tagline em 44px no mobile. Abaixo, em largura total, três linhas de lista: chute riscado em cima, item grande com quantidade lilás à direita. CTA verde de 54px logo depois da lista, e a oferta embaixo. No desktop, a lista cresce e continua sendo a peça principal.

FORM: A lista reescrita, posição 3 de 7 na lista ordenada. seed:ac87d37b649d198d. Interação de assinatura: a linha do arroz recalcula com um controle "quanto sobrou?" usando `calculateSuggestion` e reescreve a quantidade. Movimento: o risco é traçado uma vez ao entrar, e respeita `prefers-reduced-motion`.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Decisões em aberto

- Email de contato e revisão jurídica das páginas legais.

## Decisões do dono

- A frase "Nada será cobrado sem que vocês decidam assinar" fica no FAQ, confirmada pelo dono.
