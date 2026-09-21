"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useHousehold } from "@/components/household-provider";
import { fetchItemsWithHistory, type ItemWithHistory } from "@/lib/data";

export function useItems() {
  const supabase = createClient();
  const { household } = useHousehold();
  const [items, setItems] = useState<ItemWithHistory[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setItems(await fetchItemsWithHistory(supabase, household.id));
      setError(null);
    } catch {
      setError("Não foi possível carregar a despensa.");
    }
  }, [supabase, household.id]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { items, error, reload, supabase };
}
