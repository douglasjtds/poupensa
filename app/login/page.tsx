"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PoupensaLogo } from "@/components/poupensa-logo";

function LoginForm() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/despensa";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "auth" ? "Falha na autenticação. Tente novamente." : null
  );
  const [submitting, setSubmitting] = useState(false);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Email ou senha incorretos.");
      setSubmitting(false);
      return;
    }
    router.replace(next);
  }

  async function handleGoogleLogin() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) setError("Não foi possível iniciar o login com Google.");
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background p-4">
      <PoupensaLogo />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Entrar</CardTitle>
          <CardDescription>Quem pensa na despensa, poupa.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
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
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" disabled={submitting} className="h-11 w-full">
              {submitting ? "Entrando…" : "Entrar"}
            </Button>
          </form>
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className="h-11 w-full"
          >
            Continuar com Google
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Ainda não tem conta?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
