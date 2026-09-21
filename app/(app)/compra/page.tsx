"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { ItemFormDialog } from "@/components/item-form-dialog";
import { QuantityInput } from "@/components/quantity-input";
import { useItems } from "@/lib/use-items";
import { useHousehold } from "@/components/household-provider";
import { recordPurchases, todayISO } from "@/lib/data";
import { loadShoppingList, clearShoppingList } from "@/lib/shopping-list";
import { parseQuantity, validateQuantity } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Fluxo 1 (MVP-SCOPE.md): registro da compra grande do mês.
export default function CompraPage() {
  const { items, error, reload, supabase } = useItems();
  const { user } = useHousehold();
  const [date, setDate] = useState(todayISO());
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [invalid, setInvalid] = useState<Record<string, string>>({});
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [prefilledFromList, setPrefilledFromList] = useState(false);

  // Pré-preenche com a lista finalizada em /lista, se existir.
  useEffect(() => {
    if (items === null || prefilledFromList) return;
    const list = loadShoppingList();
    if (!list) return;
    const prefill: Record<string, string> = {};
    for (const entry of list) {
      if (items.some((i) => i.id === entry.itemId) && entry.quantity > 0) {
        prefill[entry.itemId] = String(entry.quantity).replace(".", ",");
      }
    }
    if (Object.keys(prefill).length > 0) {
      setQuantities((prev) => ({ ...prefill, ...prev }));
      toast.info("Quantidades pré-preenchidas com a sua lista de compras.");
    }
    setPrefilledFromList(true);
  }, [items, prefilledFromList]);

  const filled = useMemo(
    () => Object.entries(quantities).filter(([, v]) => v.trim() !== ""),
    [quantities]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors: Record<string, string> = {};
    const entries: { itemId: string; quantity: number }[] = [];
    for (const [itemId, raw] of filled) {
      const check = validateQuantity(raw);
      if (!check.ok) {
        errors[itemId] = check.error;
        continue;
      }
      const qty = parseQuantity(raw);
      if (qty > 0) entries.push({ itemId, quantity: qty });
    }
    setInvalid(errors);
    if (Object.keys(errors).length > 0) return;
    if (entries.length === 0) {
      toast.error("Informe a quantidade de pelo menos um item.");
      return;
    }

    setSaving(true);
    try {
      await recordPurchases(supabase, { userId: user.id, date, entries });
      clearShoppingList();
      setQuantities({});
      toast.success(
        `Compra registrada: ${entries.length} ${entries.length === 1 ? "item" : "itens"}`
      );
      reload();
    } catch {
      toast.error("Não foi possível registrar a compra.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="flex flex-col gap-4 p-4">
      <PageHeader title="Registrar compra" description="O que entrou na despensa hoje?" />

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="purchase-date">Data da compra</Label>
          <Input
            id="purchase-date"
            type="date"
            value={date}
            max={todayISO()}
            onChange={(e) => setDate(e.target.value)}
            className="h-11"
          />
        </div>

        {items === null ? (
          <p className="py-12 text-center text-muted-foreground">Carregando…</p>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <ShoppingCart className="size-8 text-accent" aria-hidden />
              <p className="font-medium">Nenhum item cadastrado ainda</p>
              <p className="text-sm text-muted-foreground">
                Adicione os itens comprados para registrar as quantidades.
              </p>
            </CardContent>
          </Card>
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((item) => (
              <li key={item.id}>
                <Card size="sm">
                  <CardContent className="flex items-center gap-3">
                    <Label htmlFor={`qty-${item.id}`} className="min-w-0 flex-1 truncate text-sm">
                      {item.name}
                    </Label>
                    <div className="w-36">
                      <QuantityInput
                        id={`qty-${item.id}`}
                        aria-label={`Quantidade comprada de ${item.name}`}
                        value={quantities[item.id] ?? ""}
                        onChange={(v) => setQuantities((prev) => ({ ...prev, [item.id]: v }))}
                        unit={item.unit}
                        invalid={!!invalid[item.id]}
                      />
                    </div>
                  </CardContent>
                  {invalid[item.id] && (
                    <p role="alert" className="px-4 pb-2 text-xs text-destructive">
                      {invalid[item.id]}
                    </p>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        )}

        <Button type="button" variant="outline" className="h-11" onClick={() => setFormOpen(true)}>
          <Plus className="size-4" aria-hidden />
          Adicionar item novo
        </Button>

        <Button
          type="submit"
          disabled={saving || filled.length === 0}
          className="h-12 w-full text-base"
        >
          {saving
            ? "Registrando…"
            : `Registrar compra${filled.length > 0 ? ` (${filled.length})` : ""}`}
        </Button>
      </form>

      <ItemFormDialog open={formOpen} onOpenChange={setFormOpen} item={null} onSaved={reload} />
    </main>
  );
}
