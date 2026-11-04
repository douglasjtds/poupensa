import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, TriangleAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacidade | Poupensa",
  description:
    "Rascunho da política de privacidade do Poupensa: quais dados o app guarda e por quê.",
};

const LINK_CLASS =
  "inline-flex min-h-11 items-center gap-2 text-primary underline-offset-4 hover:underline";

// Rascunho em revisão: cita só o que o app faz hoje (ver lib/ e supabase/migrations/).
export default function PrivacidadePage() {
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

      <h1 className="text-3xl font-bold tracking-tight">Privacidade</h1>
      <p>
        O Poupensa ajuda casais a planejar a compra mensal de mercado. Esta página explica quais
        dados o app guarda, para que servem e com quem são compartilhados.
      </p>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Dados que guardamos</h2>
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>
            <strong>Conta:</strong> nome e email. A senha, quando você cria uma, é tratada pelo
            serviço de autenticação.
          </li>
          <li>
            <strong>Despensa:</strong> nome da despensa, código de convite e quem faz parte dela.
          </li>
          <li>
            <strong>Itens e registros:</strong> nome e unidade dos itens, compras, conferências e
            registros de &quot;acabou&quot;, com quantidades, datas e a pessoa que registrou.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Para que usamos</h2>
        <p>
          Para você entrar na conta, mostrar a despensa e calcular a quantidade sugerida de cada
          item. O app não tem publicidade nem ferramentas de análise de terceiros.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Quem vê os seus dados</h2>
        <p>
          Os dados da despensa são compartilhados entre os dois membros: quem entra com o código de
          convite passa a ver e editar os mesmos itens e registros.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Serviços que usamos</h2>
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>
            <strong>Supabase:</strong> autenticação e banco de dados, onde ficam a conta e a
            despensa.
          </li>
          <li>
            <strong>Vercel:</strong> hospedagem do app.
          </li>
          <li>
            <strong>Google:</strong> só se você escolher entrar com o Google. Nesse caso, o login
            passa pelo Google e o app recebe os dados da sua conta, como nome e email.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Entrada por voz</h2>
        <p>
          Ditar é opcional e usa o reconhecimento de voz do próprio navegador (Web Speech API), com
          a permissão de microfone que você conceder. O processamento depende do navegador, que pode
          enviar o áudio ao serviço do fabricante. O Poupensa recebe só o texto reconhecido, que
          preenche um campo editável e é salvo apenas depois que você confirma.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Dados no seu aparelho</h2>
        <p>
          O navegador guarda cookies para manter a sessão, a lista de compras finalizada até a
          compra ser registrada e a sua escolha de dispensar o aviso de instalação do app.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Corrigir ou apagar dados</h2>
        <p>
          Dentro do app, vocês podem editar e excluir itens. O app ainda não tem uma opção para
          excluir a conta: para isso, ou para tirar dúvidas, fale com a gente pelo contato abaixo.
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

      <Link href="/termos" className={LINK_CLASS}>
        Ler os Termos de uso
      </Link>
    </main>
  );
}
