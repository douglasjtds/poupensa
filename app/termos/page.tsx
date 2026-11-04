import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, TriangleAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Termos de uso | Poupensa",
  description: "Rascunho dos termos de uso do Poupensa, app em fase de testes.",
};

const LINK_CLASS =
  "inline-flex min-h-11 items-center gap-2 text-primary underline-offset-4 hover:underline";

// Rascunho em revisão: oferta e estágio conforme PRODUCT.md.
export default function TermosPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-6 bg-background px-4 py-6 text-foreground">
      <Link href="/" className={LINK_CLASS}>
        <ArrowLeft className="size-4" aria-hidden />
        Voltar para a página inicial
      </Link>

      <p className="flex gap-2 rounded-lg border border-border bg-muted p-3 text-sm">
        <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
        <span>
          <strong>Rascunho em revisão.</strong> Este texto ainda não é a versão final e pode mudar.
        </span>
      </p>

      <h1 className="text-3xl font-bold tracking-tight">Termos de uso</h1>
      <p>
        Ao criar uma conta no Poupensa, você concorda com as condições abaixo. Elas descrevem como o
        app funciona hoje.
      </p>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">O que é o Poupensa</h2>
        <p>
          Um app para casais planejarem a compra mensal de mercado. Vocês registram a compra e
          conferem o que sobrou, e o app sugere a quantidade de cada item para a próxima compra.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Fase de testes</h2>
        <p>
          O Poupensa está em fase de testes. Telas, cálculos e funções podem mudar, e o app pode ter
          falhas ou ficar indisponível.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">3 meses grátis e cobrança</h2>
        <p>
          Os 3 primeiros meses são grátis. Hoje o app não cobra nada e não pede cartão. A intenção é
          ter, no futuro, uma versão gratuita com limite de itens e um plano pago.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">As sugestões são estimativas</h2>
        <p>
          A quantidade sugerida é uma conta feita com os dados que vocês registram, e pode não
          servir para todo mês. Revisem a lista antes de comprar: a decisão é de vocês.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Conta e despensa compartilhada</h2>
        <p>
          Cuide do acesso à sua conta e do código de convite. Quem entra com esse código passa a ver
          e editar os mesmos dados da despensa, que comporta dois membros.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Contato</h2>
        <p>
          <mark className="rounded bg-muted px-1 text-foreground">
            [email de contato a definir]
          </mark>
        </p>
      </section>

      <Link href="/privacidade" className={LINK_CLASS}>
        Ler a página de Privacidade
      </Link>
    </main>
  );
}
