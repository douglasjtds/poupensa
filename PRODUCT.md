# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Casais recém-casados ou que começaram a morar juntos há pouco tempo e fazem uma compra grande de mercado por mês. Ainda não têm uma rotina de consumo calibrada e oscilam entre comprar de menos (voltar ao mercado no meio do mês) e comprar demais (desperdício). O trabalho a fazer é saber com confiança quanto comprar de cada item para durar o mês.

Famílias de 3 ou mais pessoas e usuários solo estão fora do foco atual.

## Product Purpose

PWA que ajuda o casal a planejar a compra mensal com base em consumo real, não em achismo. Sucesso é o casal completar o segundo ciclo de conferência e compra usando o app, e usar a lista sem reescrevê-la do zero.

## Positioning

O Poupensa compara quanto o casal comprou com quanto sobrou (ou quando o item acabou) e transforma isso em uma lista com a quantidade de cada item. Bastam dois registros por ciclo, a compra e a conferência, sem anotar cada saída no dia a dia. Listas genéricas registram o quê, e apps de estoque exigem registro constante.

## Operating Context

O ciclo é mensal: registro no dia da compra grande e conferência pouco antes da próxima, em casa ou no mercado, muitas vezes no celular, com pressa ou com uma mão ocupada, e com conexão instável.

## Capabilities and Constraints

Existem hoje: despensa compartilhada entre duas pessoas, cadastro de item, registro de compra, conferência, cálculo de sugestão (`lib/domain/suggestion.ts`), lista editável, registro opcional de "acabou", entrada por voz em navegadores compatíveis e instalação como PWA.

Fora do MVP: Alexa, WhatsApp, código de barras, controle de preços e gastos, relatórios, cobrança real.

O app está em fase de testes e não cobra nada. A oferta pública é de 3 primeiros meses grátis, sem cartão. Depois disso, a intenção é um plano gratuito com limite de itens e um plano pago. Preços e limite de itens estão indefinidos e não devem ser publicados.

## Brand Commitments

- Nome: Poupensa ("poupar" + "despensa").
- Tagline oficial: "Quem pensa na despensa, poupa."
- Paleta verde e lilás, light mode, mobile-first e Geist, conforme `instructions/DESIGN-GUIDELINES.md`.
- Sugestão calculada aparece em lilás, para se diferenciar do dado inserido pelo usuário.
- Ícones Lucide, nunca emoji como ícone estrutural.
- Voz em pt-BR, direta e leve, falando com o casal. Nunca clima de app financeiro sério, de SaaS genérico ou de doméstico fofo.

## Evidence on Hand

O app nasceu da rotina de um casal, que o usa na própria despensa; os nomes não devem ser citados. Não existem depoimentos, clientes, métricas de uso nem dados de economia, e nada disso pode ser inventado. Dados de demonstração são permitidos quando identificados como exemplo.

## Product Principles

- Quantidade certa, calculada pelo consumo da própria casa, vale mais do que uma lista de "o que falta".
- Pouco registro: cada toque a mais ameaça a conferência, que é o comportamento central.
- A sugestão é editável: o casal confere e decide.
- Honestidade sobre o estágio: fase de testes declarada, sem promessa de economia em reais ou porcentagem.

## Accessibility & Inclusion

WCAG AA para contraste e alvos de toque de pelo menos 44×44px.
