# Poupensa

**Tagline:** "Quem pensa na despensa, poupa."

**Data:** 12/07/2026
**Autor:** Douglas Tertuliano
**Status:** Validating

---

## 💡 Problema

**Em uma frase:**
> Casais recém-casados ou que passaram a morar juntos não sabem quanto de cada item comprar para durar o mês, e acabam comprando pouco (voltando ao mercado no meio do mês) ou muito (desperdiçando dinheiro).

**Contexto:**
Montar a lista de compras mensal hoje é feito no "achismo" — papel, memória ou grupo de WhatsApp. Não existe histórico de quanto cada item realmente dura no consumo daquela casa, então a quantidade comprada raramente reflete a necessidade real. Esse problema é mais agudo em casais recém-juntos, que ainda não têm anos de rotina compartilhada para calibrar intuitivamente o consumo da casa — e por isso oscilam entre desperdício e falta.

---

## ✅ Solução

**Em uma frase:**
> Um app PWA onde o casal registra a compra grande do mês e faz uma conferência rápida antes da próxima compra; o app calcula automaticamente se a quantidade comprada foi suficiente e gera a lista de compras do próximo ciclo.

**Como funciona:**
No dia da compra, o casal registra os itens e as quantidades compradas. Um dia antes da próxima compra grande, fazem uma "conferência": para cada item, informam quanto ainda resta. O app cruza a quantidade comprada com o que sobrou (ou com a data em que o item acabou, se registrada) e calcula se a quantidade foi suficiente para o ciclo. A partir disso, gera automaticamente a lista de compras do próximo mês, já ajustando as quantidades para cima ou para baixo.

---

## 👤 Público-Alvo

**Persona principal:**
> Casais recém-casados ou que começaram a morar juntos recentemente, sem rotina de consumo doméstico ainda calibrada, que quer economizar e evitar tanto desperdício quanto idas extras ao mercado.

**Early adopters:**
> O próprio casal fundador (Douglas & Iara) e casais em situação similar dentro do círculo social — casamento/mudança recente, com interesse em organização doméstica e tecnologia.

---

## 🎯 Proposta de Valor

**Por que escolher o Poupensa?**
> O único app que compara automaticamente quanto você comprou com quanto durou, e converte isso em uma lista de compras pronta — sem precisar registrar cada saída de item no dia a dia.

**Alternativas atuais:**
- Lista de papel / memória (sem histórico, sem cálculo)
- Apps de lista de compras genéricos (Alexa, Google Keep) — registram o quê, não o quanto nem por quanto tempo durou
- Apps de controle de estoque (Despensa, Memento Database) — focados em rastrear item a item, exigem registro constante de saída

**Seu diferencial:**
- Apenas 2 pontos de registro por ciclo (compra + conferência), não rastreio diário
- Cálculo automático de quantidade ideal por item, não só lista de "o que falta"
- Despensa compartilhada entre casal
- Input por voz para reduzir fricção de cadastro

---

## 💰 Modelo de Negócio

**Monetização:**
> Trial gratuito de 3 meses (cobre pelo menos 2-3 ciclos completos de compra, tempo necessário para o app entregar valor real). Após o trial, modelo freemium com limite de itens cadastrados no plano gratuito.

**Pricing inicial:**
| Plano | Preço | Target |
|-------|-------|--------|
| Trial | R$ 0 (3 meses) | Todo novo usuário |
| Free | R$ 0 | Até um limite de itens na despensa |
| Mensal | ~R$ 10,90/mês | Despensa completa, sem limite de itens |
| Anual | ~R$ 5,90/mês (cobrado anual) | Casais com fidelidade de uso comprovada |

*Nota: integração de pagamento real fica fora do MVP — ver MVP-SCOPE.md.*

---

## 📊 Métricas de Sucesso

**North Star Metric:**
> % de casais que completam o segundo ciclo de conferência + compra usando o app (indica que o valor central — a comparação de consumo — está sendo entregue e usado).

**Metas iniciais (3 meses):**
- [ ] 10-15 casais usando o MVP (círculo próximo)
- [ ] 50% completando o 2º ciclo de conferência
- [ ] Validação qualitativa: casal relata economia ou redução de idas extras ao mercado

---

## 🚀 MVP Scope

**O que entra:**
- Despensa compartilhada entre 2 usuários (casal)
- Cadastro de item com quantidade e unidade
- Registro de compra
- Conferência pré-compra (quantidade restante)
- Cálculo automático de sugestão de quantidade
- Geração de lista de compras
- Registro opcional de "item acabou" no meio do ciclo
- Input por voz (Web Speech API)
- PWA mobile-first

**O que NÃO entra:**
- Integração com Alexa
- Integração com WhatsApp (áudio)
- Leitura de código de barras
- Rastreio de preços/gastos
- Pagamento real (assinatura)
- Relatórios e gráficos avançados

---

## 🛠 Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js + shadcn/ui + Tailwind |
| Backend | Supabase (Auth, Database, RLS) |
| Deploy | Vercel |
| Pagamentos (futuro) | AbacatePay ou Stripe |

---

## ⏱ Timeline

| Marco | Prazo |
|-------|-------|
| MVP pronto | A definir |
| Validação com 10-15 casais | +1 ciclo de compra (~1 mês) após MVP |
| MVP 2 (pagamentos + relatórios) | Pós-validação |

---

## ❓ Hipóteses a Validar

1. [ ] Casais completam o ciclo de conferência antes da segunda compra (comportamento central do app)
2. [ ] O cálculo automático de quantidade é percebido como mais confiável que o "achismo" atual
3. [ ] Casais recém-casados/recém-morando-juntos sentem essa dor de forma consistente (não apenas hipótese validada por conteúdo de Instagram)

---

## 🔗 Links

- Repo: [A definir — pasta local em `/Users/douglasjtds/src/poupensa`]
- Docs: `instructions/` no repo
- Design: [A definir]
- Produção: [A definir]

---

## 📝 Notas

- Nome: **Poupensa** ("poupar" + "despensa")
- Tagline oficial: **"Quem pensa na despensa, poupa."**
- Paleta: verde (economia) + lilás/roxo (identidade, foge do clichê bancário)
- Validação atual é fraca (engajamento de conteúdo em redes sociais, não confirmação de disposição a pagar) — recomenda-se validação direta com casais antes ou em paralelo ao MVP
- Alexa e WhatsApp (input por áudio) ficaram fora do MVP por custo técnico desproporcional ao estágio de validação; workaround no MVP é colar manualmente itens de outras listas
