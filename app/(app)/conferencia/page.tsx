"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { QuantityInput } from "@/components/quantity-input";
import { VoiceInputButton } from "@/components/voice-input-button";
import { useItems } from "@/lib/use-items";
import { useHousehold } from "@/components/household-provider";
import { recordChecks, todayISO } from "@/lib/data";
import { parseQuantity, validateQuantity } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Fluxo 2, parte 1 (MVP-SCOPE.md): conferência pré-compra.
// Para cada item, "quanto sobrou?". Ao salvar, oferece gerar a lista.
export default function ConferenciaPage() {
  const { items, error, reload, supabase } = useItems();
  const { user } = useHousehold();
  const router = useRouter();
  const [date, setDate] = useState(todayISO());
  const [lefts, setLefts] = useState<Record<string, string>>({});
  const [invalid, setInvalid] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const filled = useMemo(() => Object.entries(lefts).filter(([, v]) => v.trim() !== ""), [lefts]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors: Record<string, string> = {};
    const entries: { itemId: string; quantityLeft: number }[] = [];
    for (const [itemId, raw] of filled) {
      const check = validateQuantity(raw);
      if (!check.ok) {
        errors[itemId] = check.error;
        continue;
      }
      entries.push({ itemId, quantityLeft: parseQuantity(raw) });
    }
    setInvalid(errors);
    if (Object.keys(errors).length > 0) return;
    if (entries.length === 0) {
      toast.error("Informe quanto sobrou de pelo menos um item.");
      return;
    }

    setSaving(true);
    try {
      await recordChecks(supabase, { userId: user.id, date, entries });
      toast.success("Conferência salva!");
      reload();
      router.push("/lista");
    } catch {
      toast.error("Não foi possível salvar a conferência.");
      setSaving(false);
    }
  }

  return (
    <main className="flex flex-col gap-4 p-4">
      <PageHeader
        title="Conferência"
        description="Antes da próxima compra: quanto sobrou de cada item?"
      />

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="check-date">Data da conferência</Label>
          <Input
            id="check-date"
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
              <ClipboardCheck className="size-8 text-accent" aria-hidden />
              <p className="font-medium">Nada para conferir ainda</p>
              <p className="text-sm text-muted-foreground">
                Cadastre itens na despensa e registre uma compra primeiro.
              </p>
            </CardContent>
          </Card>
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((item) => (
              <li key={item.id}>
                <Card size="sm">
                  <CardContent className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <Label htmlFor={`left-${item.id}`} className="text-sm font-medium">
                        {item.name}
                      </Label>
                      {item.lastPurchase && (
                        <span className="text-xs text-muted-foreground">
                          comprou {item.lastPurchase.quantity} {item.unit}
                        </span>
                      )}
                    </div>
                    <QuantityInput
                      id={`left-${item.id}`}
                      aria-label={`Quanto sobrou de ${item.name}`}
                      value={lefts[item.id] ?? ""}
                      onChange={(v) => setLefts((prev) => ({ ...prev, [item.id]: v }))}
                      unit={item.unit}
                      invalid={!!invalid[item.id]}
                      slotEnd={
                        <VoiceInputButton
                          label={`Ditar quanto sobrou de ${item.name}`}
                          mode="quantity"
                          onResult={(text) => setLefts((prev) => ({ ...prev, [item.id]: text }))}
                        />
                      }
                    />
                    {invalid[item.id] && (
                      <p role="alert" className="text-xs text-destructive">
                        {invalid[item.id]}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}

        <Button
          type="submit"
          disabled={saving || filled.length === 0}
          className="h-12 w-full text-base"
        >
          {saving ? "Salvando…" : "Salvar conferência e gerar lista"}
        </Button>
      </form>
    </main>
  );
}
