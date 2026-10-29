"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { Household, HouseholdMember } from "@/types/database";

type HouseholdContextValue = {
  user: User;
  household: Household;
  members: (HouseholdMember & { isCurrentUser: boolean })[];
  refresh: () => Promise<void>;
};

const HouseholdContext = createContext<HouseholdContextValue | null>(null);

export function useHousehold() {
  const ctx = useContext(HouseholdContext);
  if (!ctx) throw new Error("useHousehold precisa estar dentro de <HouseholdProvider>");
  return ctx;
}

// Guarda client-side das rotas do app: exige usuário autenticado E household.
// Sem sessão → /login; sem household → /onboarding.
// Carrega uma vez ao montar e de novo só em login/logout — trocar de aba não
// refaz as consultas.
export function HouseholdProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [household, setHousehold] = useState<Household | null>(null);
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    setFailed(false);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setUser(user);

    const { data: membership, error: membershipError } = await supabase
      .from("household_members")
      .select("household_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (membershipError) {
      setFailed(true);
      return;
    }
    if (!membership) {
      router.replace("/onboarding");
      return;
    }

    const [{ data: hh, error: hhError }, { data: allMembers, error: membersError }] =
      await Promise.all([
        supabase.from("households").select("*").eq("id", membership.household_id).single(),
        supabase.from("household_members").select("*").eq("household_id", membership.household_id),
      ]);

    if (hhError || membersError || !hh) {
      setFailed(true);
      return;
    }
    setHousehold(hh);
    setMembers(allMembers ?? []);
    setLoading(false);
  }, [supabase, router]);

  useEffect(() => {
    load();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") load();
    });
    return () => subscription.unsubscribe();
  }, [supabase, load]);

  const value = useMemo<HouseholdContextValue | null>(() => {
    if (!user || !household) return null;
    return {
      user,
      household,
      members: members.map((m) => ({ ...m, isCurrentUser: m.user_id === user.id })),
      refresh: load,
    };
  }, [user, household, members, load]);

  if (failed) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background p-4">
        <p role="alert" className="text-center text-muted-foreground">
          Não foi possível carregar sua casa.
        </p>
        <Button className="h-11" onClick={load}>
          Tentar de novo
        </Button>
      </div>
    );
  }

  if (loading || !value) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando…</p>
      </div>
    );
  }

  return <HouseholdContext.Provider value={value}>{children}</HouseholdContext.Provider>;
}
