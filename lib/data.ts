// Consultas tipadas ao Supabase usadas pelas telas do core loop.
// Mantém as páginas finas: cada tela chama uma função daqui.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Item, PurchaseRecord, CheckRecord, DepletedRecord } from "@/types/database";
import { calculateSuggestion, type Suggestion } from "@/lib/domain/suggestion";

export type Supabase = SupabaseClient<Database>;

export type ItemWithHistory = Item & {
  purchases: PurchaseRecord[];
  checks: CheckRecord[];
  depletions: DepletedRecord[];
  lastPurchase: PurchaseRecord | null;
  lastCheck: CheckRecord | null;
  suggestion: Suggestion;
};

export async function fetchItemsWithHistory(
  supabase: Supabase,
  householdId: string
): Promise<ItemWithHistory[]> {
  const { data: items, error } = await supabase
    .from("items")
    .select("*")
    .eq("household_id", householdId)
    .order("name");
  if (error) throw error;
  if (!items || items.length === 0) return [];

  const itemIds = items.map((i) => i.id);
  const [{ data: purchases }, { data: checks }, { data: depletions }] = await Promise.all([
    supabase.from("purchase_records").select("*").in("item_id", itemIds),
    supabase.from("check_records").select("*").in("item_id", itemIds),
    supabase.from("depleted_records").select("*").in("item_id", itemIds),
  ]);

  return items.map((item) => {
    const itemPurchases = (purchases ?? []).filter((p) => p.item_id === item.id);
    const itemChecks = (checks ?? []).filter((c) => c.item_id === item.id);
    const itemDepletions = (depletions ?? []).filter((d) => d.item_id === item.id);
    const byDateDesc = <T extends { created_at: string }>(a: T, b: T) =>
      b.created_at.localeCompare(a.created_at);

    const lastPurchase =
      [...itemPurchases].sort((a, b) => b.purchased_at.localeCompare(a.purchased_at))[0] ?? null;
    const lastCheck =
      [...itemChecks].sort(
        (a, b) => b.checked_at.localeCompare(a.checked_at) || byDateDesc(a, b)
      )[0] ?? null;

    return {
      ...item,
      purchases: itemPurchases,
      checks: itemChecks,
      depletions: itemDepletions,
      lastPurchase,
      lastCheck,
      suggestion: calculateSuggestion({
        purchases: itemPurchases.map((p) => ({ quantity: p.quantity, date: p.purchased_at })),
        checks: itemChecks.map((c) => ({ quantityLeft: c.quantity_left, date: c.checked_at })),
        depletions: itemDepletions.map((d) => ({ date: d.depleted_at })),
      }),
    };
  });
}

export async function createItem(
  supabase: Supabase,
  params: {
    householdId: string;
    name: string;
    unit: string;
    initialQuantity?: number | null;
    userId: string;
  }
): Promise<Item> {
  const { data: item, error } = await supabase
    .from("items")
    .insert({ household_id: params.householdId, name: params.name.trim(), unit: params.unit })
    .select()
    .single();
  if (error) throw error;

  // "Cadastro de item (nome, unidade, quantidade)": a quantidade inicial vira
  // um registro de compra de hoje, para o histórico já nascer coerente.
  if (params.initialQuantity != null && params.initialQuantity > 0) {
    const { error: prError } = await supabase.from("purchase_records").insert({
      item_id: item.id,
      quantity: params.initialQuantity,
      created_by: params.userId,
    });
    if (prError) throw prError;
  }
  return item;
}

export async function updateItem(
  supabase: Supabase,
  itemId: string,
  changes: { name?: string; unit?: string }
): Promise<void> {
  const { error } = await supabase.from("items").update(changes).eq("id", itemId);
  if (error) throw error;
}

export async function deleteItem(supabase: Supabase, itemId: string): Promise<void> {
  const { error } = await supabase.from("items").delete().eq("id", itemId);
  if (error) throw error;
}

export async function recordPurchases(
  supabase: Supabase,
  params: {
    userId: string;
    date: string; // YYYY-MM-DD
    entries: { itemId: string; quantity: number }[];
  }
): Promise<void> {
  const rows = params.entries.map((e) => ({
    item_id: e.itemId,
    quantity: e.quantity,
    purchased_at: params.date,
    created_by: params.userId,
  }));
  const { error } = await supabase.from("purchase_records").insert(rows);
  if (error) throw error;
}

export async function recordChecks(
  supabase: Supabase,
  params: {
    userId: string;
    date: string;
    entries: { itemId: string; quantityLeft: number }[];
  }
): Promise<void> {
  const rows = params.entries.map((e) => ({
    item_id: e.itemId,
    quantity_left: e.quantityLeft,
    checked_at: params.date,
    created_by: params.userId,
  }));
  const { error } = await supabase.from("check_records").insert(rows);
  if (error) throw error;
}

export async function recordDepleted(
  supabase: Supabase,
  params: { userId: string; itemId: string; date: string }
): Promise<void> {
  const { error } = await supabase.from("depleted_records").insert({
    item_id: params.itemId,
    depleted_at: params.date,
    created_by: params.userId,
  });
  if (error) throw error;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
