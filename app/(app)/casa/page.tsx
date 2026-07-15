"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, LogOut, Users } from "lucide-react";
import { useHousehold } from "@/components/household-provider";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

export default function CasaPage() {
  const { user, household, members } = useHousehold();
  const supabase = createClient();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const partnerMissing = members.length < 2;

  async function copyInvite() {
    await navigator.clipboard.writeText(household.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <main className="flex flex-col gap-4 p-4">
      <PageHeader title={household.name} description="Sua despensa compartilhada" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="size-4 text-accent" aria-hidden />
            Quem participa
          </CardTitle>
          {partnerMissing && (
            <CardDescription>
              Convide seu parceiro ou parceira com o código abaixo — vocês dois passam a ver e
              registrar a mesma despensa.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {members.map((m) => (
            <div key={m.user_id} className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  {m.isCurrentUser
                    ? ((user.user_metadata?.name as string | undefined) ?? user.email ?? "?")
                        .slice(0, 1)
                        .toUpperCase()
                    : "P"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">
                {m.isCurrentUser
                  ? `Você (${(user.user_metadata?.name as string | undefined) ?? user.email})`
                  : "Parceiro(a)"}
              </span>
              {m.isCurrentUser && <Badge variant="secondary">você</Badge>}
            </div>
          ))}

          {partnerMissing && (
            <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-dashed border-accent/50 bg-accent/5 p-4">
              <div>
                <p className="text-xs text-muted-foreground">Código de convite</p>
                <p className="font-mono text-xl font-semibold tracking-[0.3em] text-accent-hover">
                  {household.invite_code}
                </p>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={copyInvite}
                aria-label="Copiar código de convite"
                className="h-11"
              >
                {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
                {copied ? "Copiado" : "Copiar"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Button variant="outline" onClick={handleLogout} className="h-11">
        <LogOut className="size-4" aria-hidden />
        Sair da conta
      </Button>
    </main>
  );
}
