"use client";

import { useState } from "react";
import { CircleAlert, Package, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { ItemFormDialog } from "@/components/item-form-dialog";
import { DepletedDialog } from "@/components/depleted-dialog";
import { useItems } from "@/lib/use-items";
import { deleteItem } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ItemWithHistory } from "@/lib/data";
import type { Item } from "@/types/database";

function formatQty(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, "").replace(".", ",");
}

function ItemStatus({ item }: { item: ItemWithHistory }) {
  const lastDepletion = [...item.depletions].sort((a, b) =>
    b.depleted_at.localeCompare(a.depleted_at)
  )[0];
  const depletedAfterCheck =
    lastDepletion && (!item.lastCheck || lastDepletion.depleted_at >= item.lastCheck.checked_at);

  if (depletedAfterCheck) {
    return (
      <Badge className="bg-destructive/10 text-destructive">
        <CircleAlert className="size-3" aria-hidden />
        acabou
      </Badge>
    );
  }
  if (item.lastCheck) {
    const left = item.lastCheck.quantity_left;
    if (left <= 0) {
      return <Badge className="bg-destructive/10 text-destructive">em falta</Badge>;
    }
    return (
      <Badge variant="secondary">
        sobrou {formatQty(left)} {item.unit}
      </Badge>
    );
  }
  if (item.lastPurchase) {
    return (
      <Badge variant="secondary">
        comprado {formatQty(item.lastPurchase.quantity)} {item.unit}
      </Badge>
    );
  }
  return <Badge variant="secondary">sem registros</Badge>;
}

export default function DespensaPage() {
  const { items, error, reload, supabase } = useItems();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [depletingItem, setDepletingItem] = useState<ItemWithHistory | null>(null);
  const [deleting, setDeleting] = useState<ItemWithHistory | null>(null);

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await deleteItem(supabase, deleting.id);
      toast.success(`"${deleting.name}" removido`);
      setDeleting(null);
      reload();
    } catch {
      toast.error("Não foi possível remover o item.");
    }
  }

  return (
    <main className="flex flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-2">
        <PageHeader title="Despensa" description="Os itens que a casa acompanha" />
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="h-11"
        >
          <Plus className="size-4" aria-hidden />
          Item
        </Button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      {items === null ? (
        <p className="py-12 text-center text-muted-foreground">Carregando…</p>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <Package className="size-8 text-accent" aria-hidden />
            <p className="font-medium">Sua despensa está vazia</p>
            <p className="text-sm text-muted-foreground">
              Adicione os itens que vocês compram todo mês — arroz, café, sabão…
            </p>
          </CardContent>
        </Card>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.id}>
              <Card size="sm">
                <CardContent className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{item.name}</p>
                    <div className="pt-1">
                      <ItemStatus item={item} />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-11"
                    onClick={() => setDepletingItem(item)}
                  >
                    Acabou
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    className="size-11"
                    aria-label={`Editar ${item.name}`}
                    onClick={() => {
                      setEditing(item);
                      setFormOpen(true);
                    }}
                  >
                    <Pencil className="size-4" aria-hidden />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    className="size-11 text-destructive"
                    aria-label={`Remover ${item.name}`}
                    onClick={() => setDeleting(item)}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <ItemFormDialog open={formOpen} onOpenChange={setFormOpen} item={editing} onSaved={reload} />
      <DepletedDialog
        item={depletingItem}
        onOpenChange={(open) => !open && setDepletingItem(null)}
        onSaved={reload}
      />

      <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Remover item?</DialogTitle>
            <DialogDescription>
              {deleting
                ? `"${deleting.name}" e todo o histórico de compras e conferências dele serão removidos.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row justify-end gap-2">
            <Button variant="outline" className="h-11" onClick={() => setDeleting(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" className="h-11" onClick={confirmDelete}>
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
