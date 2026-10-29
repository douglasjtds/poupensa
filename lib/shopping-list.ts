// Handoff da lista de compras finalizada (/lista → /compra) via localStorage.
// A lista gerada não é persistida no banco (não faz parte do modelo de dados
// do PRD) — ela é recalculável a partir dos registros a qualquer momento.

export type ShoppingListEntry = {
  itemId: string;
  name: string;
  unit: string;
  quantity: number;
};

const KEY = "poupensa.shopping-list";

export function saveShoppingList(entries: ShoppingListEntry[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries));
  } catch {
    // storage cheio/indisponível: handoff é conveniência, não requisito
  }
}

export function loadShoppingList(): ShoppingListEntry[] | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ShoppingListEntry[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearShoppingList(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
