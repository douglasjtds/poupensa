"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PoupensaLogo } from "@/components/poupensa-logo";
import { validateInviteCode } from "@/lib/validation";

// Onboarding: usuário autenticado mas sem household — cria um novo
// ou entra no do parceiro/parceira via código de convite.
export default function OnboardingPage() {
  const supabase = createClient();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [householdName, setHouseholdName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login?next=/onboarding");
        return;
      }
      const { data: membership } = await supabase
        .from("household_members")
        .select("household_id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (membership) {
        router.replace("/despensa");
        return;
      }
      setChecking(false);
    })();
  }, [supabase, router]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error } = await supabase.rpc("create_household", {
      household_name: householdName.trim() || "Nossa casa",
    });
    if (error) {
      setError("Não foi possível criar a despensa. Tente novamente.");
      setSubmitting(false);
      return;
    }
    router.replace("/despensa");
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const valid = validateInviteCode(inviteCode);
    if (!valid.ok) {
      setError(valid.error);
      return;
    }
    setSubmitting(true);
    setError(null);
    const { error } = await supabase.rpc("join_household_by_code", {
      code: inviteCode.trim().toUpperCase(),
    });
    if (error) {
      setError(
        error.message.includes("full")
          ? "Essa despensa já tem 2 pessoas."
          : "Código inválido. Confira com quem te convidou."
      );
      setSubmitting(false);
      return;
    }
    router.replace("/despensa");
  }

  if (checking) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background p-4">
      <PoupensaLogo />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sua despensa compartilhada</CardTitle>
          <CardDescription>
            Crie a despensa da casa ou entre na que seu parceiro ou parceira já criou.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create">
            <TabsList className="w-full">
              <TabsTrigger value="create" className="flex-1">
                Criar despensa
              </TabsTrigger>
              <TabsTrigger value="join" className="flex-1">
                Tenho convite
              </TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <form onSubmit={handleCreate} className="flex flex-col gap-4 pt-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="household-name">Nome da casa</Label>
                  <Input
                    id="household-name"
                    placeholder="Ex.: Casa Douglas & Iara"
                    value={householdName}
                    onChange={(e) => setHouseholdName(e.target.value)}
                    className="h-11"
                  />
                </div>
                <Button type="submit" disabled={submitting} className="h-11 w-full">
                  {submitting ? "Criando…" : "Criar despensa"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="join">
              <form onSubmit={handleJoin} className="flex flex-col gap-4 pt-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="invite-code">Código de convite</Label>
                  <Input
                    id="invite-code"
                    placeholder="Ex.: A1B2C3"
                    autoCapitalize="characters"
                    maxLength={6}
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    className="h-11 font-mono tracking-widest"
                  />
                </div>
                <Button type="submit" disabled={submitting} className="h-11 w-full">
                  {submitting ? "Entrando…" : "Entrar na despensa"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          {error && (
            <p role="alert" className="pt-3 text-sm text-destructive">
              {error}
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
