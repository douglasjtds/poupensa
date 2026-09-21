# Poupensa

**Autor:** Douglas Tertuliano
**Data:** 12/07/2026
**Status:** Draft

---

## Overview

Poupensa é um PWA que ajuda casais a planejar a compra mensal de mercado com base em consumo real, não em achismo. O app compara a quantidade comprada com a quantidade que sobrou (ou o tempo que durou) e gera automaticamente a lista de compras do próximo ciclo, ajustada por item.

---

## Problem

### O que está acontecendo?
Casais recém-casados ou que passaram a morar juntos recentemente não têm histórico de consumo doméstico calibrado. A lista de compras mensal é feita de memória ou papel, sem dado real de quanto cada item dura, resultando em compra insuficiente (viagens extras ao mercado) ou excessiva (desperdício de dinheiro).

### Quem é afetado?
Casais recém-juntos, ainda sem rotina de consumo doméstico estabelecida, especialmente os que fazem uma compra mensal grande em vez de compras semanais pequenas.

### Qual o custo de não resolver?
Gasto extra por compra em excesso, tempo perdido em idas não planejadas ao mercado, fricção no casal por divergência sobre "quanto comprar de cada coisa".

### Como resolvem hoje?
Lista de papel, apps de lista de compras genéricos (Alexa, Google Keep) que registram *o quê* mas não *quanto* nem *por quanto tempo durou*, ou simplesmente memória/estimativa no momento da compra.

---

## Goals

- [ ] **Goal 1:** Casais completam o ciclo de conferência + nova compra usando o app → Métrica: % de casais que chegam ao 2º ciclo
- [ ] **Goal 2:** Reduzir a percepção de compra insuficiente/excessiva → Métrica: feedback qualitativo pós-uso (survey simples)
- [ ] **Goal 3:** Validar se o modelo de dados (quantidade comprada vs restante) gera sugestões percebidas como úteis → Métrica: % de sugestões aceitas sem edição manual

---

## Non-Goals

- ❌ Rastreio diário de consumo item a item
- ❌ Integração com Alexa ou WhatsApp nesta versão
- ❌ Leitura de código de barras
- ❌ Controle de gastos/preços
- ❌ Cobrança de assinatura real

---

## User Stories

### Persona 1: Casal recém-junto (usuário principal)

> Casal que mora junto há pouco tempo, faz uma compra grande mensal, e quer parar de "chutar" a quantidade de cada item.

- Como casal, eu quero registrar a compra do mês com quantidade por item, para ter um histórico real de consumo
- Como casal, eu quero fazer uma conferência rápida antes da próxima compra, para saber o que ainda tenho e o que preciso repor
- Como casal, eu quero receber uma lista de compras já com as quantidades sugeridas, para não precisar calcular manualmente
- Como casal, eu quero registrar opcionalmente quando um item acabou no meio do mês, para o app refinar a estimativa de consumo
- Como casal, eu quero que ambos tenhamos acesso à mesma despensa, para que qualquer um possa registrar ou consultar

### Persona 2: Usuário cadastrando por voz

> Mesmo usuário, em contexto de cozinha/mercado com as mãos ocupadas.

- Como usuário, eu quero cadastrar itens por voz, para não precisar digitar com as mãos ocupadas ou sujas
- Como usuário, eu quero que o app confirme visualmente o que entendeu da fala, para corrigir erros de reconhecimento antes de salvar

---

## Solution

### Visão Geral

O Poupensa opera em um ciclo de duas etapas principais por mês: registro de compra e conferência pré-compra. No registro de compra, o casal informa os itens e quantidades adquiridas. Próximo à data da próxima compra, o app solicita a conferência: quanto sobrou de cada item. Com base na comparação entre o que foi comprado e o que sobrou (ou a data em que o item acabou, se informada), o sistema calcula se a quantidade foi suficiente e sugere o ajuste para o próximo ciclo, gerando a lista de compras automaticamente.

A despensa é compartilhada entre os dois membros do casal via conta vinculada, permitindo que qualquer um dos dois registre ou consulte o estado da despensa.

### Features Principais

| Feature | Descrição | Prioridade |
|---------|-----------|------------|
| Despensa compartilhada | Dois usuários com acesso à mesma despensa | Must have |
| Cadastro de item | Nome, unidade, quantidade | Must have |
| Registro de compra | Registrar itens + quantidades da compra do mês | Must have |
| Conferência pré-compra | Informar quanto sobrou de cada item antes da próxima compra | Must have |
| Cálculo de sugestão | Comparar comprado vs restante e sugerir quantidade do próximo ciclo | Must have |
| Geração de lista de compras | Lista consolidada com quantidades sugeridas | Must have |
| Registro opcional de "acabou" | Marcar data em que um item terminou no meio do ciclo | Should have |
| Input por voz | Cadastro de itens via Web Speech API | Should have |

### User Flow

1. Casal cria conta e convida o parceiro/parceira para a despensa compartilhada
2. No dia da compra grande, um dos dois registra os itens comprados com quantidade
3. (Opcional) Durante o mês, se um item acabar antes do esperado, qualquer um marca "acabou" com a data
4. Um dia antes da próxima compra, o app notifica/permite iniciar a conferência
5. Casal informa quanto sobrou de cada item cadastrado
6. Sistema calcula a sugestão de quantidade por item e gera a lista de compras
7. Casal usa a lista na próxima compra, reiniciando o ciclo

---

## Technical Approach

### Stack
- **Frontend:** Next.js 14+ App Router, shadcn/ui, Tailwind CSS
- **Backend:** Supabase (Auth, Database, Row Level Security)
- **Infra:** Vercel

### Arquitetura

```
[Cliente PWA] → [Next.js] → [Supabase]
                     ↓
          [Auth + DB + RLS compartilhado entre casal]
```

### Modelo de Dados (alto nível)

- `households` (unidade familiar/casal) — agrupa os 2 usuários
- `items` (itens da despensa) — nome, unidade, household_id
- `purchase_records` (registros de compra) — item_id, quantidade, data
- `check_records` (registros de conferência) — item_id, quantidade restante, data
- `depleted_records` (registro opcional de "acabou") — item_id, data

### Integrações
- [ ] Supabase Auth (email + Google OAuth)
- [ ] Supabase Database + RLS (isolamento por household)
- [ ] Web Speech API (input por voz, client-side, sem infra adicional)

### Constraints
- Client-side first, mínimo de server-side
- Fluxo de conferência deve tolerar conectividade instável (usuário no mercado ou em casa com wifi fraco) — considerar cache local com sincronização

---

## Design Guidelines

Ver `DESIGN-GUIDELINES.md` para detalhes completos de paleta, tipografia e componentes.

### Estilo Visual
- Clean, moderno, light mode
- Referências: Linear, Resend, Vercel
- Base: shadcn/ui
- Paleta: verde (economia) + lilás/roxo (identidade)

---

## Success Metrics

| Métrica | Baseline | Target | Como medir |
|---------|----------|--------|------------|
| Casais no 2º ciclo | 0% | ≥ 50% | Eventos de conferência completada por household |
| Sugestões aceitas sem edição | — | ≥ 60% | Comparação entre sugestão gerada e lista final editada |
| Casais ativos após trial | 0 | ≥ 30% do grupo piloto | Retenção pós-3 meses |

---

## Timeline

| Fase | Descrição | Duração | Entregáveis |
|------|-----------|---------|-------------|
| Setup | Auth, households, deploy base | A definir | Projeto rodando em produção |
| Core Loop | Compra, conferência, cálculo, lista | A definir | Fluxo completo funcional |
| Polish | Voz, ajustes de UX | A definir | MVP pronto para piloto |
| Piloto | Uso real com 10-15 casais | 1-2 ciclos de compra | Dados de retenção e feedback |

---

## Risks & Assumptions

### Assumptions
- Casais estão dispostos a fazer a conferência pré-compra mesmo sem obrigatoriedade de registro diário
- A "validação" atual (engajamento com conteúdo sobre organização doméstica) se traduz em disposição real de uso — **ainda não confirmado**

### Risks
| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Baixa adesão à conferência mensal | Média | Alto | UI de baixo esforço + input por voz; lembrete no app |
| Validação de mercado fraca (baseada em engajamento de conteúdo, não demanda real) | Alta | Alto | Rodar validação qualitativa direta com casais em paralelo ao MVP |
| Dado incompleto (conferência pulada em algum mês) | Média | Médio | Sistema deve lidar com gaps sem quebrar o cálculo (usar último dado disponível) |

---

## Open Questions

- [ ] Notificação de "hora de fazer a conferência" será push (exige permissão) ou apenas indicador dentro do app?
- [ ] Como o sistema lida com item que nunca é conferido (esquecido em algum ciclo)?
- [ ] Qual o limite de itens do plano gratuito pós-trial?

---

## Appendix

### Pesquisas/Entrevistas
- Validação inicial baseada em conteúdo de redes sociais sobre organização doméstica — recomendado complementar com entrevistas diretas antes de investir além do MVP

### Competitors
- Apps de controle de estoque geral (Despensa, Memento Database, Controle de Inventário) — focados em rastreio item a item, não em cálculo de quantidade ideal por ciclo
- Listas de compras genéricas (Google Keep, Alexa Shopping List) — sem histórico de consumo ou cálculo automático
