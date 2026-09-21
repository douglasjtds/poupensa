@AGENTS.md

# Poupensa — Regras do Repositório

App PWA para casais planejarem a compra mensal com base em consumo real.
Fonte de verdade de escopo/design: os 5 documentos em `instructions/`
(BRIEF.md, PRD.md, MVP-SCOPE.md, LANDING-PAGE-SPEC.md, DESIGN-GUIDELINES.md).
Não implemente nada listado como "fora do MVP" nesses documentos.

## Onde cada tipo de arquivo vive (NÃO mover)

| Tipo de arquivo                                  | Local obrigatório                                            |
| ------------------------------------------------ | ------------------------------------------------------------ |
| Rotas, páginas e layouts                         | `app/` (App Router; rota = pasta com `page.tsx`)             |
| Componentes shadcn/ui gerados                    | `components/ui/` (não editar manualmente além do necessário) |
| Componentes de produto reutilizáveis             | `components/` (fora de `ui/`)                                |
| Lógica pura / domínio (ex.: cálculo de sugestão) | `lib/domain/` — sem imports de React ou Supabase             |
| Clientes e helpers de Supabase                   | `lib/supabase/`                                              |
| Utilitários genéricos                            | `lib/`                                                       |
| Tipos compartilhados                             | `types/`                                                     |
| Migrations SQL do Supabase                       | `supabase/migrations/`                                       |
| Seed de dados                                    | `supabase/seed.sql` (ou scripts em `supabase/`)              |
| Testes unitários                                 | `tests/unit/`                                                |
| Testes de integração                             | `tests/integration/`                                         |
| Testes E2E (Playwright)                          | `e2e/`                                                       |
| Assets estáticos (ícones, manifest)              | `public/`                                                    |
| Documentos de produto                            | `instructions/` (somente leitura, não gerar código aqui)     |

Regras:

- Lógica de negócio (especialmente o cálculo de sugestão) fica em módulos puros
  em `lib/domain/`, testáveis sem UI e sem rede.
- Client-side first: mínimo de server-side (conforme PRD.md).
- Nunca criar pastas paralelas para o mesmo propósito (ex.: `src/`, `utils/`,
  `__tests__/` espalhados). Este repo NÃO usa `src/`.

## Comandos

- `npm run dev` — dev server
- `npm run build` — build de produção
- `npm run lint` — ESLint
- `npm run format` — Prettier
- `npm run test:unit` — Vitest (tests/unit)
- `npm run test:integration` — Vitest (tests/integration; exige TEST_DATABASE_URL)
- `npm run test:integration:local` — sobe Postgres descartável + migrations e roda a suíte
- `npm run test:e2e` — Playwright (sobe o dev server sozinho)

## Design

- Light mode only, mobile-first, touch targets ≥ 44×44px.
- Paleta: verde `#1F9D55` (primary) + lilás `#8B5CF6` (accent) — ver
  `instructions/DESIGN-GUIDELINES.md` antes de criar qualquer UI.
- Ícones: Lucide. Nunca emoji como ícone estrutural.
