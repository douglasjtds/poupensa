"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { buttonVariants } from "@/components/ui/button";
import { PoupensaLogo } from "@/components/poupensa-logo";
import { cn } from "@/lib/utils";

// Raiz: usuário logado vai direto para a despensa; visitante vê o convite
// de entrada. (Landing page completa: ver LANDING-PAGE-SPEC.md — pós-MVP.)
export default function HomePage() {
  const supabase = createClient();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.replace("/despensa");
      } else {
        setChecking(false);
      }
    });
  }, [supabase, router]);

  if (checking) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-background p-6 text-center">
      <PoupensaLogo />
      <div className="flex max-w-md flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Quem pensa na despensa, poupa.</h1>
        <p className="text-muted-foreground">
          Registre a compra do mês, confira o que sobrou antes da próxima e receba a lista de
          compras com as quantidades certas — calculadas pelo consumo real da sua casa.
        </p>
      </div>
      <div className="flex w-full max-w-xs flex-col gap-3">
        <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "h-12")}>
          Começar grátis
        </Link>
        <Link
          href="/login"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12")}
        >
          Já tenho conta
        </Link>
      </div>
    </main>
  );
}
