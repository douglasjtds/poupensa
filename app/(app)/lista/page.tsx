"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ListChecks, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { QuantityInput } from "@/components/quantity-input";
import { useItems } from "@/lib/use-items";
import { saveShoppingList } from "@/lib/shopping-list";
import { parseQuantity, validateQuantity } from "@/lib/validation";
import type { SuggestionBasis } from "@/lib/domain/suggestion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const BASIS_LABEL: Record<SuggestionBasis, string> = {
  "no-history": "sem histórico",
  "no-check": "última compra",
  check: "consumo real",
  depleted: "acabou no ciclo",
  "ran-out-at-check": "zerou na conferência",
};

function formatQty(n: number): string {
  return Number.isInteger(n) ? String(n) : String(n).replace(".", ",");
}

// Fluxo 2, parte 2 (MVP-SCOPE.md): lista de compras gerada a partir das
// sugestões, editável antes de finalizar. A sugestão calculada aparece em
// lilás (accent) para diferenciar de dado inserido pelo usuário
// (DESIGN-GUIDELINES.md).
export default function ListaPage() {
  const { items, error } = useItems();
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [included, setIncluded] = useState<Record<string, boolean>>({});
  const [edited, setEdited] = useState<Record<string, boolean>>({});
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (items === null || initialized) return;
    const qty: Record<string, string> = {};
    const inc: Record<string, boolean> = {};
    for (const item of items) {
      const s = item.suggestion;
      if (s.quantity != null && s.quantity > 0) {
        qty[item.id] = formatQty(s.quantity);
        inc[item.id] = true;
      } else {
        qty[item.id] = "";
        inc[item.id] = false;
      }
    }
    setQuantities(qty);
    setIncluded(inc);
    setInitialized(true);
  }, [items, initialized]);

  const selectedCount = useMemo(() => Object.values(included).filter(Boolean).length, [included]);

  function handleFinalize() {
    if (!items) return;
    const entries = [];
    for (const item of items) {
      if (!included[item.id]) continue;
      const raw = quantities[item.id] ?? "";
      const check = validateQuantity(raw);
      if (!check.ok) {
        toast.error(`Quantidade inválida em "${item.name}".`);
        return;
      }
      const qty = parseQuantity(raw);
      if (qty > 0) {
        entries.push({ itemId: item.id, name: item.name, unit: item.unit, quantity: qty });
      }
    }
    if (entries.length === 0) {
      toast.error("Selecione pelo menos um item com quantidade.");
      return;
    }
    saveShoppingList(entries);
    toast.success("Lista pronta! Use-a ao registrar a compra.");
    router.push("/compra");
  }

  return (
    <main className="flex flex-col gap-4 p-4">
      <PageHeader
        title="Lista de compras"
        description="Quantidades sugeridas pelo consumo real da casa — ajuste à vontade"
      />

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
            <ListChecks className="size-8 text-accent" aria-hidden />
            <p className="font-medium">Sem itens para listar</p>
            <p className="text-sm text-muted-foreground">
              Cadastre itens, registre uma compra e faça a conferência para gerar a lista.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => {
            const s = item.suggestion;
            const hasSuggestion = s.quantity != null && s.quantity > 0;
            return (
              <li key={item.id}>
                <Card size="sm" className={included[item.id] ? "" : "opacity-60"}>
                  <CardContent className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={`inc-${item.id}`}
                        checked={included[item.id] ?? false}
                        onCheckedChange={(checked) =>
                          setIncluded((prev) => ({ ...prev, [item.id]: checked === true }))
                        }
                        aria-label={`Incluir ${item.name} na lista`}
                        className="size-5"
                      />
                      <Label htmlFor={`inc-${item.id}`} className="min-w-0 flex-1 truncate">
                        {item.name}
                      </Label>
                      {hasSuggestion && !edited[item.id] ? (
                        <Badge className="bg-accent/10 text-accent-hover">
                          <Sparkles className="size-3" aria-hidden />
                          {formatQty(s.quantity!)} {item.unit} · {BASIS_LABEL[s.basis]}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">{BASIS_LABEL[s.basis]}</Badge>
                      )}
                    </div>
                    {included[item.id] && (
                      <div className="pl-8">
                        <QuantityInput
                          aria-label={`Quantidade de ${item.name} na lista`}
                          value={quantities[item.id] ?? ""}
                          onChange={(v) => {
                            setQuantities((prev) => ({ ...prev, [item.id]: v }));
                            setEdited((prev) => ({ ...prev, [item.id]: true }));
                          }}
                          unit={item.unit}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      {items !== null && items.length > 0 && (
        <Button onClick={handleFinalize} className="h-12 w-full text-base">
          Finalizar lista ({selectedCount})
        </Button>
      )}
    </main>
  );
}
