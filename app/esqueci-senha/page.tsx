"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PoupensaLogo } from "@/components/poupensa-logo";

// Pede o link de redefinição. O template emails/reset-password.html monta o
// link com token_hash a partir deste redirectTo (ver emails/README.md), e o
// /auth/callback valida e manda para /redefinir-senha já com sessão.
export default function EsqueciSenhaPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/redefinir-senha`,
    });
    setSubmitting(false);
    // Email inexistente não gera erro no Supabase; os erros que chegam aqui são
    // de envio (ex.: limite de tentativas). A confirmação é neutra de propósito,
    // para não revelar quais emails têm conta.
    if (error) {
      setError(
        error.status === 429
          ? "Muitas tentativas. Aguarde alguns minutos e tente de novo."
          : "Não foi possível enviar o link. Tente novamente."
      );
      return;
    }
    setSent(true);
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background p-4">
      <PoupensaLogo />
      <Card className="w-full max-w-sm">
        {sent ? (
          <CardHeader>
            <CardTitle className="text-xl">Confira seu email</CardTitle>
            <CardDescription>
              Se existir uma conta com <strong>{email}</strong>, enviamos um link para criar uma
              senha nova. Pode abrir o link em qualquer aparelho.
            </CardDescription>
          </CardHeader>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="text-xl">Esqueci minha senha</CardTitle>
              <CardDescription>
                Informe o email da sua conta e enviamos um link para criar uma senha nova.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                  />
                </div>
                {error && (
                  <p role="alert" className="text-sm text-destructive">
                    {error}
                  </p>
                )}
                <Button type="submit" disabled={submitting} className="h-11 w-full">
                  {submitting ? "Enviando…" : "Enviar link"}
                </Button>
              </form>
            </CardContent>
          </>
        )}
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center font-medium text-primary underline-offset-4 hover:underline"
            >
              Voltar para o login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
