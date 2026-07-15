"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
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
export function HouseholdProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [household, setHousehold] = useState<Household | null>(null);
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    setUser(user);

    const { data: membership } = await supabase
      .from("household_members")
      .select("household_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!membership) {
      router.replace("/onboarding");
      return;
    }

    const [{ data: hh }, { data: allMembers }] = await Promise.all([
      supabase.from("households").select("*").eq("id", membership.household_id).single(),
      supabase.from("household_members").select("*").eq("household_id", membership.household_id),
    ]);

    if (hh) setHousehold(hh);
    setMembers(allMembers ?? []);
    setLoading(false);
  }, [supabase, router, pathname]);

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo<HouseholdContextValue | null>(() => {
    if (!user || !household) return null;
    return {
      user,
      household,
      members: members.map((m) => ({ ...m, isCurrentUser: m.user_id === user.id })),
      refresh: load,
    };
  }, [user, household, members, load]);

  if (loading || !value) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando…</p>
      </div>
    );
  }

  return <HouseholdContext.Provider value={value}>{children}</HouseholdContext.Provider>;
}
