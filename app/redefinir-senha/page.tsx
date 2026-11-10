"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PoupensaLogo } from "@/components/poupensa-logo";
import { MIN_PASSWORD_LENGTH, validateNewPassword } from "@/lib/validation";

// Destino do link de redefinição. Quem chega aqui já tem sessão: o
// /auth/callback validou o token_hash do email. Sem sessão, o proxy manda
// para o login.
export default function RedefinirSenhaPage() {
  const supabase = createClient();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const check = validateNewPassword(password, confirmation);
    if (!check.ok) {
      setError(check.error);
      return;
    }
    setSubmitting(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      const messages: Partial<Record<string, string>> = {
        same_password: "A senha nova precisa ser diferente da atual.",
        // A política de senha do projeto Supabase pode ser mais exigente que o mínimo do app.
        weak_password: "Senha fraca. Use mais caracteres, misturando letras e números.",
      };
      setError(
        (error.code && messages[error.code]) ??
          "Não foi possível salvar a senha. Peça um novo link e tente de novo."
      );
      setSubmitting(false);
      return;
    }
    toast.success("Senha alterada.");
    router.replace("/despensa");
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background p-4">
      <PoupensaLogo />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Criar senha nova</CardTitle>
          <CardDescription>Use pelo menos {MIN_PASSWORD_LENGTH} caracteres.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Senha nova</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={MIN_PASSWORD_LENGTH}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmation">Repita a senha nova</Label>
              <Input
                id="confirmation"
                type="password"
                autoComplete="new-password"
                required
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                className="h-11"
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" disabled={submitting} className="h-11 w-full">
              {submitting ? "Salvando…" : "Salvar senha"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
