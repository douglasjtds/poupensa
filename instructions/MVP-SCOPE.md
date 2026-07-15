# Poupensa - MVP Scope

**Data:** 12/07/2026
**Versão:** 1.0

---

## Visão do MVP

**Em uma frase, o que o MVP faz?**

> Permite que um casal registre a compra mensal de mercado, faça uma conferência rápida antes da próxima compra, e receba automaticamente uma lista de compras com quantidades ajustadas por item.

**Qual hipótese estamos testando?**

> Casais completam o ciclo de conferência antes da segunda compra, usando o app de forma consistente o suficiente para o cálculo de sugestão ter valor real.

**Como saberemos que funcionou?**

> % de casais do grupo piloto que completam a conferência e chegam ao 2º ciclo de compra usando o app.

---

## Escopo: O que ENTRA

### Must Have (P0) - Sem isso não lança

| Feature | Descrição | Critério de Done |
| ------- | --------- | ---------------- |
| Auth + Household compartilhado | Casal cria conta e compartilha a mesma despensa | 2 usuários acessam e editam os mesmos dados |
| Cadastro de item | Nome, unidade, quantidade | Item salvo e editável |
| Registro de compra | Registrar itens + quantidades compradas em uma data | Registro persistido e listado no histórico do item |
| Conferência pré-compra | Informar quanto sobrou de cada item cadastrado | Conferência salva e associada ao ciclo correspondente |
| Cálculo de sugestão | Comparar comprado vs restante e sugerir quantidade do próximo ciclo | Sugestão exibida por item com lógica consistente e testável |
| Geração de lista de compras | Lista consolidada com quantidades sugeridas | Lista gerada automaticamente após conferência, editável antes de finalizar |

### Should Have (P1) - Importante, mas pode esperar v1.1

| Feature | Descrição | Por que não é P0 |
| ------- | --------- | ----------------- |
| Registro opcional de "acabou" | Marcar data em que item terminou no meio do ciclo | Refina o cálculo, mas o MVP funciona sem ele usando só compra + conferência |
| Input por voz | Cadastro de item via Web Speech API | Reduz fricção, mas cadastro manual já viabiliza o teste da hipótese central |

### Could Have (P2) - Nice to have

| Feature | Descrição | Quando considerar |
| ------- | --------- | ------------------ |
| Notificação push de "hora da conferência" | Lembrete automático próximo à data da próxima compra | Após confirmar que o fluxo manual já funciona |
| Categorização de itens | Agrupar itens por categoria (limpeza, alimentos, etc.) | Se a despensa crescer muito e a lista ficar difícil de navegar |

---

## Escopo: O que NÃO ENTRA

### Explicitamente Fora do MVP

| Feature | Por que não entra | Quando reconsiderar |
| ------- | ------------------ | --------------------- |
| Integração com Alexa | Custo técnico alto (Skill própria + certificação) desproporcional ao estágio de validação | Após validar tração real, se pedido recorrente do público |
| Integração com WhatsApp (áudio) | Requer infra própria de recepção/transcrição de áudio | Pós-MVP, como diferencial de produto já validado |
| Leitura de código de barras | Não é o gargalo do problema (o gargalo é "quanto comprar", não "o que é o item") | Se o volume de itens cadastrados manualmente virar fricção real |
| Controle de preços/gastos | Foco do MVP é quantidade, não valor monetário | MVP 2, se usuários pedirem visão de economia em R$ |
| Pagamento real (assinatura) | Hipótese central não depende de cobrança; adiciona risco técnico sem validar aprendizado core | MVP 2, após confirmar retenção no 2º ciclo |
| Relatórios e gráficos | Nice to have que não testa a hipótese principal | Pós-validação, se usuários pedirem histórico visual |

### Tentações Comuns a Evitar

- [x] Múltiplos tipos de usuário (foque em um) — só casal, sem admin/gestor
- [x] Dashboard de admin elaborado
- [x] Analytics avançados
- [x] Múltiplas integrações (Alexa, WhatsApp) — fora do MVP
- [ ] Multi-tenancy complexo — não aplica (household simples)
- [x] Internacionalização (i18n)
- [x] Mobile app nativo — PWA é suficiente
- [x] API pública
- [x] Marketplace/plugins
- [x] Billing complexo (múltiplos planos) — sem billing no MVP

---

## Decisões de Simplificação

### Autenticação
- [x] Supabase Auth default (email + Google OAuth)

### Billing
- [x] Free only no MVP (sem cobrança real; trial e freemium chegam no MVP 2)

### UI/UX
- [x] Light mode only
- [x] Mobile-first (PWA)
- [x] shadcn/ui default styling, com paleta verde + lilás customizada

### Features
- [x] CRUD básico primeiro (itens, compras, conferências)
- [x] Sem bulk actions
- [x] Sem export/import
- [x] Sem histórico/versioning elaborado (histórico simples de registros é suficiente)
- [x] Sem real-time (polling ou refresh manual ok, dado que os 2 usuários não editam simultaneamente com frequência)

---

## Personas no MVP

### Persona Principal (foco total)

**Nome:** Casal recém-junto
**Quem é:** Casal recém-casado ou recém-morando-junto, sem rotina de consumo doméstico calibrada, que faz uma compra mensal grande
**Job to be Done:** Saber com confiança quanto comprar de cada item para durar o mês, sem desperdício nem falta

### Personas FORA do MVP

| Persona | Por que não agora |
| ------- | ------------------ |
| Famílias grandes (3+ pessoas) | Padrão de consumo mais complexo; foco inicial é validar o modelo com o caso mais simples (casal) |
| Usuário solo | Não testa a hipótese de despensa compartilhada, que é diferencial do produto |

---

## Fluxos Críticos

### Fluxo 1: Registro de Compra

```
1. Usuário abre o app no dia da compra grande
2. Usuário adiciona itens (ou seleciona existentes) com quantidade comprada
3. Sistema salva o registro de compra vinculado à data e ao household
4. Usuário confirma e finaliza o registro
```

### Fluxo 2: Conferência e Geração de Lista

```
1. Usuário inicia a conferência (manualmente, próximo à data da próxima compra)
2. Sistema lista os itens da despensa com o campo "quanto sobrou?"
3. Usuário informa a quantidade restante por item
4. Sistema calcula a sugestão de quantidade para o próximo ciclo
5. Sistema gera a lista de compras consolidada
6. Usuário revisa, ajusta se necessário, e usa a lista na compra
```

---

## Stack do MVP

### Escolhas Definitivas

| Camada     | Tecnologia           | Justificativa       |
| ---------- | --------------------- | -------------------- |
| Frontend   | Next.js               | Performance, DX, mesmo padrão do Gasolinha |
| Styling    | Tailwind + shadcn      | Speed, consistência  |
| Backend    | Supabase               | Auth + DB + RLS, suporta household compartilhado |
| Deploy     | Vercel                 | Zero config |
| Pagamentos | Fora do MVP            | Não necessário para validar hipótese central |

### O que NÃO usar (complexidade desnecessária)

- [x] GraphQL (REST/Supabase client é suficiente)
- [x] State management complexo (React state/Zustand leve, se necessário)
- [x] Micro-frontends
- [x] Kubernetes
- [x] Multiple databases
- [x] Message queues
- [x] Microservices

---

## Definition of Done (MVP)

O MVP está pronto quando:

- [ ] Todas as features P0 funcionando (despensa compartilhada, cadastro, compra, conferência, cálculo, lista)
- [ ] Fluxo completo testado ponta a ponta (compra → conferência → lista) com dados reais
- [ ] Deploy em produção (Vercel)
- [ ] Pelo menos 1 casal (fundadores) completando o ciclo real
- [ ] Métrica de "chegada ao 2º ciclo" rastreável no banco

---

## Riscos e Mitigações

| Risco       | Probabilidade | Impacto | Mitigação                     |
| ----------- | -------------- | -------- | -------------------------------- |
| Scope creep (adicionar Alexa/WhatsApp cedo demais) | Alta | Alto | Revisar este documento antes de qualquer nova feature |
| Validação de mercado ainda fraca | Alta | Alto | Rodar conversas diretas com casais em paralelo ao desenvolvimento |
| Conferência esquecida/pulada | Média | Médio | Interface de baixo esforço; considerar lembrete simples (P2) |

---

## Hipóteses a Validar

| Hipótese                                          | Como validar        | Sucesso =                    |
| -------------------------------------------------- | -------------------- | ------------------------------ |
| Casais completam a conferência antes da 2ª compra   | Evento registrado no app | ≥ 50% do grupo piloto |
| Sugestão de quantidade é percebida como útil        | Feedback qualitativo  | Casal usa a lista sem reescrever do zero |
| Problema é real além do círculo próximo             | Entrevistas diretas   | ≥ 3 de 5 casais confirmam a dor sem indução |

---

## Próximos Passos Pós-MVP

1. [ ] Validação qualitativa direta com casais fora do círculo próximo
2. [ ] Registro opcional de "acabou" (P1)
3. [ ] Input por voz (P1)
4. [ ] Pagamento real + freemium (MVP 2)
5. [ ] Integração WhatsApp para input por áudio (avaliar viabilidade pós-tração)

---

## Regra de Ouro

Quando em dúvida se algo entra no MVP, pergunte:

> "Posso validar minha hipótese principal (casais chegam ao 2º ciclo) SEM essa feature?"

Se sim → Não entra no MVP.
