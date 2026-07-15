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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuantityInput } from "@/components/quantity-input";
import { VoiceInputButton } from "@/components/voice-input-button";
import { useHousehold } from "@/components/household-provider";
import { createClient } from "@/lib/supabase/client";
import { createItem, updateItem } from "@/lib/data";
import {
  UNITS,
  parseQuantity,
  validateItemName,
  validateQuantity,
  validateUnit,
} from "@/lib/validation";
import type { Item } from "@/types/database";

// Criação/edição de item. No modo criação, a quantidade inicial (opcional)
// vira um registro de compra de hoje. O estado do formulário vive em
// ItemForm, montado apenas com o dialog aberto — abre sempre limpo.
export function ItemFormDialog({
  open,
  onOpenChange,
  item,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: Item | null;
  onSaved: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        {open && (
          <ItemForm
            key={item?.id ?? "new"}
            item={item ?? null}
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

function ItemForm({ item, onDone }: { item: Item | null; onDone: () => void }) {
  const supabase = createClient();
  const { household, user } = useHousehold();
  const editing = !!item;
  const [name, setName] = useState(item?.name ?? "");
  const [unit, setUnit] = useState<string>(item?.unit ?? "un");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nameCheck = validateItemName(name);
    if (!nameCheck.ok) return setError(nameCheck.error);
    const unitCheck = validateUnit(unit);
    if (!unitCheck.ok) return setError(unitCheck.error);
    if (!editing && quantity !== "") {
      const qtyCheck = validateQuantity(quantity);
      if (!qtyCheck.ok) return setError(qtyCheck.error);
    }

    setSaving(true);
    setError(null);
    try {
      if (editing && item) {
        await updateItem(supabase, item.id, { name: name.trim(), unit });
        toast.success("Item atualizado");
      } else {
        await createItem(supabase, {
          householdId: household.id,
          name,
          unit,
          initialQuantity: quantity === "" ? null : parseQuantity(quantity),
          userId: user.id,
        });
        toast.success("Item adicionado à despensa");
      }
      onDone();
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      setError(
        message.includes("duplicate")
          ? "Já existe um item com esse nome."
          : "Não foi possível salvar. Tente novamente."
      );
      setSaving(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{editing ? "Editar item" : "Novo item"}</DialogTitle>
        <DialogDescription>
          {editing ? "Ajuste o nome ou a unidade do item." : "Cadastre um item da despensa."}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="item-name">Nome</Label>
          <div className="flex items-center gap-2">
            <Input
              id="item-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Arroz"
              className="h-11 flex-1"
            />
            <VoiceInputButton label="Ditar nome do item" onResult={(text) => setName(text)} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="item-unit">Unidade</Label>
          <Select value={unit} onValueChange={(v) => v && setUnit(v)}>
            <SelectTrigger id="item-unit" className="h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {UNITS.map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {!editing && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="item-quantity">Quantidade em casa agora (opcional)</Label>
            <QuantityInput id="item-quantity" value={quantity} onChange={setQuantity} unit={unit} />
          </div>
        )}
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" disabled={saving} className="h-11 w-full">
          {saving ? "Salvando…" : editing ? "Salvar" : "Adicionar item"}
        </Button>
      </form>
    </>
  );
}
