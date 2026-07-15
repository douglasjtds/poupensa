"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHousehold } from "@/components/household-provider";
import { createClient } from "@/lib/supabase/client";
import { recordDepleted, todayISO } from "@/lib/data";
import type { Item } from "@/types/database";

// Registro opcional de "acabou": qualquer item pode ser marcado como esgotado
// numa data específica, fora do ciclo de conferência (MVP-SCOPE P1).
// O estado vive em DepletedForm, montado só com o dialog aberto — cada
// abertura começa com a data de hoje sem precisar de efeito de reset.
export function DepletedDialog({
  item,
  onOpenChange,
  onSaved,
}: {
  item: Item | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}) {
  return (
    <Dialog open={!!item} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        {item && (
          <DepletedForm
            key={item.id}
            item={item}
            onDone={() => {
              onOpenChange(false);
              onSaved();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function DepletedForm({ item, onDone }: { item: Item; onDone: () => void }) {
  const supabase = createClient();
  const { user } = useHousehold();
  const [date, setDate] = useState(todayISO());
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await recordDepleted(supabase, { userId: user.id, itemId: item.id, date });
      toast.success(`Anotado: ${item.name} acabou`);
      onDone();
    } catch {
      toast.error("Não foi possível registrar. Tente novamente.");
      setSaving(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{item.name} acabou?</DialogTitle>
        <DialogDescription>
          Registrar quando acabou ajuda o cálculo da próxima compra a ficar mais preciso.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="depleted-date">Quando acabou</Label>
          <Input
            id="depleted-date"
            type="date"
            value={date}
            max={todayISO()}
            onChange={(e) => setDate(e.target.value)}
            className="h-11"
          />
        </div>
        <Button type="submit" disabled={saving} className="h-11 w-full">
          {saving ? "Registrando…" : "Registrar"}
        </Button>
      </form>
    </>
  );
}
