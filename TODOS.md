# Poupensa - TODOS.md

> Prompts prontos para colar, organizados por etapa. Pensado pra rodar com Claude Fable 5 (ou Claude Code) de forma orquestrada — o prompt master no topo instrui o próprio modelo a decompor em subagents/loops por fase. Cada fase abaixo também funciona standalone, caso prefira rodar uma de cada vez e revisar entre elas.

**Pré-requisito:** os 5 documentos de `instructions/` (BRIEF.md, PRD.md, MVP-SCOPE.md, LANDING-PAGE-SPEC.md, DESIGN-GUIDELINES.md) precisam estar no repo antes de rodar qualquer prompt abaixo — todos os prompts referenciam esses arquivos em vez de repetir o contexto.

**Recomendação:** mesmo rodando o prompt master, revise o output ao final de cada fase antes de deixar seguir pra próxima — principalmente a Fase 2 (schema do banco), porque migrações erradas são caras de corrigir depois.

---

## 🎯 PROMPT MASTER (orquestração completa)

> Cole isso sozinho se quiser que o Fable 5 rode o projeto inteiro do início ao fim, decompondo em subagents e iterando até os testes passarem em cada fase.

```
Você vai implementar o MVP do Poupensa neste repositório. Antes de escrever qualquer
código, leia os 5 documentos em /instructions (BRIEF.md, PRD.md, MVP-SCOPE.md,
LANDING-PAGE-SPEC.md, DESIGN-GUIDELINES.md) — eles são a fonte de verdade sobre
escopo, modelo de dados, paleta e regras de negócio. Não implemente nada que esteja
listado como "fora do MVP" nesses documentos.

Trabalhe em 7 fases, nesta ordem, sem pular etapas:
1. Setup do projeto (Next.js + Supabase + Tailwind + shadcn/ui + CI básico)
2. Modelagem de dados e RLS no Supabase (households, items, purchase_records,
   check_records, depleted_records)
3. Autenticação + household compartilhado (convite do parceiro/parceira)
4. Core loop: cadastro de item, registro de compra, conferência pré-compra,
   cálculo de sugestão, geração de lista de compras
5. Input por voz (Web Speech API) como alternativa ao cadastro manual
6. PWA (manifest, service worker, instalabilidade)
7. Hardening: testes unitários, testes de integração, testes E2E, revisão de
   acessibilidade (contraste, touch targets, aria-labels) conforme
   DESIGN-GUIDELINES.md

Para cada fase:
- Se a tarefa for grande o suficiente para paralelizar (ex: schema + RLS policies
  + seed de dados), use subagents para dividir o trabalho e depois integre os
  resultados você mesmo antes de seguir.
- Ao final de cada fase, rode os testes relevantes daquela fase. Se falhar, entre
  em loop de correção (fix → re-run → repita) até passar, ou até 5 tentativas —
  se ainda falhar depois de 5, pare e reporte o que travou em vez de continuar
  silenciosamente.
- Não avance para a próxima fase com testes quebrados na fase atual.
- Ao fim de cada fase, escreva um resumo curto do que foi feito e o que ficou
  pendente, antes de iniciar a próxima.

Cobertura de testes esperada (não pule isso mesmo sob pressão de tempo):
- Testes unitários: lógica de cálculo de sugestão de quantidade (a parte mais
  crítica do produto — cubra casos de conferência ausente, item novo sem
  histórico, e "acabou" registrado no meio do ciclo)
- Testes de integração: fluxo compra → conferência → geração de lista, incluindo
  RLS (usuário A não pode ver/editar despensa de usuário B)
- Testes E2E: os 2 fluxos críticos descritos no MVP-SCOPE.md (Fluxo 1: Registro
  de Compra, Fluxo 2: Conferência e Geração de Lista), incluindo o caso de dois
  usuários do mesmo household

Stack obrigatória: Next.js 14+ App Router, TypeScript, Supabase (Auth + Postgres
+ RLS), Tailwind CSS, shadcn/ui, Vercel. Client-side first, mínimo de
server-side, conforme PRD.md.

Ao terminar as 7 fases, gere um relatório final listando: o que foi implementado,
que testes existem e onde estão, o que ficou como TODO explícito (se algo do
MVP não coube), e quais variáveis de ambiente / configuração manual ainda
precisam ser feitas por mim no Supabase/Vercel.
```

---

## Fase 1 — Setup do Projeto

```
Configure a base do projeto Poupensa: Next.js 14+ App Router com TypeScript,
Tailwind CSS, shadcn/ui inicializado, ESLint + Prettier, e estrutura de pastas
seguindo convenção App Router (app/, components/, lib/, types/).

Adicione um CLAUDE.md na raiz do repo com regras explícitas de onde cada tipo de
arquivo deve viver, pra evitar que a CLI mova arquivos pra lugar errado em
sessões futuras (esse projeto teve esse problema no Gasolinha).

Configure Vitest (ou Jest, o que for mais simples de integrar com Next.js 14)
para testes unitários e de integração, e Playwright para testes E2E — apenas
a infraestrutura de testes, sem escrever testes ainda (isso vem na Fase 7).

Adicione um workflow simples de CI (GitHub Actions) que rode lint + testes
unitários a cada push.

Não implemente nenhuma feature de produto ainda — esta fase é só esqueleto e
tooling. Ao final, rode o projeto localmente e confirme que builda sem erro.
```

---

## Fase 2 — Modelagem de Dados e Supabase

```
Com base no modelo de dados descrito em PRD.md (seção "Modelo de Dados"), crie
as migrations do Supabase para as tabelas:

- households (unidade familiar/casal)
- household_members (relação usuário <-> household, para permitir 2 usuários
  por household)
- items (nome, unidade, household_id)
- purchase_records (item_id, quantidade, data)
- check_records (item_id, quantidade restante, data)
- depleted_records (item_id, data — registro opcional de "acabou")

Implemente Row Level Security em todas as tabelas: um usuário só pode ler/
escrever dados de households dos quais é membro (via household_members).

Escreva um seed script simples com dados fictícios de um household de teste
(2 usuários, 5-6 itens, alguns registros de compra e conferência) para
facilitar desenvolvimento e testes.

Ao final desta fase, documente o schema final (pode ser um schema.md dentro de
/instructions ou comentários nas migrations) e liste explicitamente quais
policies de RLS foram criadas para cada tabela.
```

---

## Fase 3 — Autenticação e Household Compartilhado

```
Implemente autenticação via Supabase Auth (email/senha + Google OAuth).

Implemente o fluxo de household compartilhado:
- Ao criar conta, o usuário cria um household ou entra em um existente via
  convite (link ou código simples)
- O segundo usuário (parceiro/parceira) aceita o convite e passa a ter acesso
  à mesma despensa
- Qualquer um dos dois membros pode registrar compra, fazer conferência, ou
  consultar o histórico

Trate o caso de usuário sem household ainda (onboarding: criar ou entrar em
household antes de acessar o resto do app).

Não implemente nenhuma feature de item/compra/conferência ainda — isso é
Fase 4. Esta fase termina quando dois usuários conseguem se autenticar e
confirmar que compartilham o mesmo household_id.
```

---

## Fase 4 — Core Loop (Item, Compra, Conferência, Cálculo, Lista)

```
Implemente o core loop completo do Poupensa, seguindo os Fluxos Críticos
descritos em MVP-SCOPE.md:

1. Cadastro de item (nome, unidade, quantidade) — CRUD básico
2. Registro de compra: usuário seleciona/adiciona itens com quantidade
   comprada e data
3. Conferência pré-compra: para cada item da despensa, usuário informa
   quanto sobrou
4. Registro opcional de "acabou": qualquer item pode ser marcado como
   esgotado numa data específica, fora do ciclo de conferência
5. Cálculo de sugestão de quantidade: compare o que foi comprado com o que
   sobrou (ou, se disponível, com a data de "acabou") e calcule a quantidade
   sugerida para o próximo ciclo. Trate explicitamente estes casos de borda:
   - Item sem histórico de conferência anterior (primeira compra)
   - Conferência pulada em algum ciclo (gap de dados)
   - Item marcado como "acabou" antes da conferência formal
6. Geração de lista de compras: lista consolidada com as quantidades
   sugeridas, editável pelo usuário antes de finalizar

Siga a paleta e componentes definidos em DESIGN-GUIDELINES.md (verde/lilás,
shadcn/ui, mobile-first, touch targets 44x44px mínimo).

Isole a lógica de cálculo de sugestão em uma função/módulo puro e testável
separadamente da UI — ela vai precisar de testes unitários pesados na Fase 7.

Não implemente input por voz ainda (Fase 5) nem PWA (Fase 6).
```

---

## Fase 5 — Input por Voz

```
Adicione input por voz como alternativa ao cadastro manual, usando a Web
Speech API do navegador (sem infraestrutura de backend adicional).

Aplicável em: cadastro de item e registro de quantidade na conferência.

Importante: sempre mostre ao usuário o texto que foi reconhecido antes de
salvar, permitindo correção manual — não salve direto da transcrição sem
confirmação visual (erro de reconhecimento de fala é comum e a correção
precisa ser rápida).

Trate o caso de navegador sem suporte à Web Speech API (fallback silencioso
para o input manual, sem quebrar a tela).
```

---

## Fase 6 — PWA

```
Configure o Poupensa como PWA instalável: manifest.json, ícones em múltiplos
tamanhos, service worker básico (cache de assets estáticos, não precisa de
funcionamento offline completo do core loop nesta fase).

Adicione prompt de instalação (sugestão de "adicionar à tela inicial") seguindo
o padrão mobile-first já estabelecido.

Confirme que o app builda e funciona como PWA tanto em Android quanto em iOS
(Safari tem suporte mais limitado a service workers — documente qualquer
limitação encontrada).
```

---

## Fase 7 — Testes (Unitários, Integração, E2E)

```
Escreva a suíte de testes completa do Poupensa:

TESTES UNITÁRIOS (prioridade máxima — é a lógica mais crítica do produto):
- Função de cálculo de sugestão de quantidade: cubra caso normal (comprou X,
  sobrou Y, sugestão ajustada), item novo sem histórico, conferência pulada
  (gap de ciclo), item com "acabou" registrado antes da conferência, e
  quantidade zero em ambos os extremos
- Validações de formulário (quantidade não pode ser negativa, unidade
  obrigatória, etc.)

TESTES DE INTEGRAÇÃO:
- Fluxo completo compra → conferência → lista gerada, incluindo persistência
  real no Supabase (ou um Supabase local/test instance)
- RLS: usuário de um household não consegue ler nem escrever dados de outro
  household, mesmo autenticado
- Convite e vínculo de segundo usuário ao household

TESTES E2E (Playwright):
- Fluxo 1 (Registro de Compra): usuário loga, adiciona itens, registra compra,
  confirma persistência
- Fluxo 2 (Conferência e Geração de Lista): usuário inicia conferência,
  informa quantidades restantes, recebe lista gerada, edita e finaliza
- Cenário com 2 usuários do mesmo household: um registra a compra, o outro
  faz a conferência, confirmando que os dados são visíveis para ambos

Rode a suíte inteira ao final e reporte cobertura por camada (unit/integration/
e2e). Se algum teste estiver flaky, corrija a causa raiz antes de reportar
como concluído — não marque como "done" com testes instáveis.
```

---

## Ordem de Execução Recomendada

```
Fase 1 → Fase 2 → Fase 3 → Fase 4 → Fase 7 (testes do core loop)
                                  → Fase 5 → Fase 6 → Fase 7 (testes finais)
```

Rodar os testes do core loop (Fase 7 parcial) logo após a Fase 4 evita acumular
dívida de teste sobre a parte mais arriscada do produto (o cálculo de sugestão).
Voz e PWA são aditivos e podem ganhar testes próprios depois.
