# Poupensa

> **Quem pensa na despensa, poupa.**

PWA para casais planejarem a compra mensal de mercado com base em consumo real:
registre a compra do mês, faça uma conferência rápida antes da próxima, e receba
a lista de compras com as quantidades certas por item.

Documentos de produto (fonte de verdade): [`instructions/`](instructions/) ·
Regras do repositório: [`CLAUDE.md`](CLAUDE.md) · Schema e RLS:
[`supabase/SCHEMA.md`](supabase/SCHEMA.md)

## Stack

Next.js (App Router, TypeScript) · Tailwind CSS v4 · shadcn/ui · Supabase
(Auth + Postgres + RLS) · Vercel

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencha com as chaves do seu projeto Supabase
npm run dev
```

Banco: aplique as migrations de `supabase/migrations/` no seu projeto Supabase
(via `supabase db push` ou SQL Editor) e, para dados de desenvolvimento, o
`supabase/seed.sql` (apenas em ambiente local — cria 2 usuários de teste).

### Configuração manual no Supabase

1. Criar projeto e copiar URL + anon key para `.env.local`
2. Aplicar migrations (e seed, se local)
3. Auth → Providers: habilitar **Email** e **Google** (para OAuth, configurar
   client ID/secret no Google Cloud Console e a redirect URL
   `https://<projeto>.supabase.co/auth/v1/callback`)
4. Auth → URL Configuration: adicionar a URL do app (local e produção) em
   _Redirect URLs_ (`http://localhost:3000/auth/callback`, etc.)

## Testes

```bash
npm run test:unit         # Vitest — cálculo de sugestão, validações, voz
npm run test:integration  # Vitest — RLS/fluxo com Postgres local (ver tests/integration)
npm run test:e2e          # Playwright — fluxos críticos (exige Supabase configurado)
```

## PWA

- `public/manifest.webmanifest` + ícones em `public/icons/`
- `public/sw.js`: cache de assets estáticos apenas (o core loop **não** funciona
  offline neste MVP — decisão de escopo da Fase 6)
- Prompt de instalação: nativo no Android/Chrome (`beforeinstallprompt`); no
  iOS/Safari é exibida uma dica manual

### Limitações conhecidas no iOS/Safari

- Não existe `beforeinstallprompt`: instalação só manual (Compartilhar →
  Adicionar à Tela de Início)
- O service worker só fica ativo enquanto o PWA está em uso; o iOS pode
  descartar caches sob pressão de armazenamento
- Web Speech API (`webkitSpeechRecognition`): suporte parcial no iOS — quando
  indisponível, o botão de microfone simplesmente não aparece (fallback manual)
- `display: standalone` funciona, mas notificações push exigem iOS 16.4+ e
  ficam fora do MVP
