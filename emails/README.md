# Templates de email transacional

Emails de autenticação do Supabase, em HTML standalone. Cada arquivo é colado
inteiro no painel do Supabase — não há build step. A pasta está no
`.prettierignore` de propósito: o Prettier quebraria os comentários
condicionais do Outlook.

## Mapeamento para o Supabase

Dashboard › **Authentication › Emails**:

| Arquivo                 | Template no painel   | Variáveis                                    | Disparado hoje? |
| ----------------------- | -------------------- | -------------------------------------------- | --------------- |
| `confirm-signup.html`   | Confirm signup       | `{{ .ConfirmationURL }}`                     | Sim (cadastro com email/senha) |
| `invite-user.html`      | Invite user          | `{{ .ConfirmationURL }}`                     | Não (convite do parceiro é por código) |
| `magic-link.html`       | Magic Link           | `{{ .ConfirmationURL }}`                     | Não |
| `change-email.html`     | Change Email Address | `{{ .ConfirmationURL }}`                     | Não |
| `reset-password.html`   | Reset Password       | `{{ .RedirectTo }}`, `{{ .TokenHash }}`      | Não (ver pendência abaixo) |
| `reauthentication.html` | Reauthentication     | `{{ .Token }}`                               | Não |

Todos usam `{{ .SiteURL }}` no link da logo.

> Os **assuntos** dos emails são configurados no painel, não nestes arquivos.
> Sugestões: "Confirme seu cadastro no Poupensa", "Você foi convidado para o
> Poupensa", "Seu link de acesso ao Poupensa", "Confirme seu novo email",
> "Redefinir sua senha do Poupensa", "Seu código de verificação do Poupensa".

Cole os templates nos **dois projetos** Supabase (dev e prod).

### Por que o Reset Password não usa `{{ .ConfirmationURL }}`

O `ConfirmationURL` segue o fluxo PKCE: o link volta com um `code` que só pode
ser trocado por sessão no **mesmo navegador** em que o pedido foi feito, porque
é lá que fica guardado o code verifier. Quem pede no computador e abre o email
no celular cairia no login com erro.

Por isso o template monta o link à mão, com o `token_hash`:

```
{{ .RedirectTo }}&amp;token_hash={{ .TokenHash }}&amp;type=recovery
```

O `/auth/callback` (`app/auth/callback/route.ts`) valida o token com
`verifyOtp`, que não depende do navegador, e redireciona para o `next`. O
`&amp;` é o `&` escapado dentro do HTML.

O `RedirectTo` é o endereço que o app deve passar no `resetPasswordForEmail`:
`{origem}/auth/callback?next=/redefinir-senha` — por isso o restante da URL
começa com `&`. Se a origem não estiver em **Authentication › URL
Configuration › Redirect URLs**, o Supabase troca o `RedirectTo` pelo Site URL
puro; o template detecta isso (`{{ if eq .RedirectTo .SiteURL }}`) e monta o
caminho do callback a partir do `{{ .SiteURL }}`.

### Pendência: fluxo de "esqueci a senha"

O template e o callback estão prontos, mas o app ainda **não tem** a tela de
"esqueci a senha" (que chama `resetPasswordForEmail` com o `redirectTo` acima)
nem a página `/redefinir-senha`. Até existirem, este email não é disparado.

## Estrutura compartilhada

Os 6 arquivos usam o mesmo esqueleto; só muda o miolo (`<h1>`, introdução,
ação e nota do rodapé). Ao mexer no layout, **replique a mudança nos 6**.

- Tabelas + estilos inline (compatibilidade com Outlook/Gmail)
- Acentuação sempre em entidades HTML (`&ccedil;`, `&atilde;`, …)
- Preheader oculto no topo do `<body>` controla o texto de preview
- Barra de marca de 4px (verde `#1F9D55` / lilás `#8B5CF6`) no topo do card
- Logo em HTML puro (selo lilás com "P" + wordmark "Pou**pensa**"), sem
  imagem — não depende de domínio publicado nem de deploy prévio
- Botão CTA `#188345` com texto branco (contraste AA) e fallback VML para o
  Outlook desktop; link em texto puro como alternativa
- Somente light mode (`color-scheme: light`), como o app
- Cores e tipografia seguem `instructions/DESIGN-GUIDELINES.md`

## Pré-visualizar

Abrir o `.html` direto no navegador já mostra o layout. Para testar de verdade,
cole o template no projeto de **dev** e dispare a ação correspondente (um
cadastro real, por exemplo), conferindo no Gmail e no Apple Mail.
