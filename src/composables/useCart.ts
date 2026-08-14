import { computed, ref, type ComputedRef, type Ref } from 'vue';
import type { CartItem, Watch } from '../types';

export type UseCart = {
  items: Ref<CartItem[]>;
  totalItems: ComputedRef<number>;
  totalPrice: ComputedRef<number>;
  addItem: (watch: Watch) => void;
  removeItem: (watchId: number) => void;
  clear: () => void;
};

/**
 * Composable de panier, fourni clé en main à titre d'exemple. Tu peux t'en
 * inspirer pour `useWatches` (idiome ref + computed + fonctions exposées).
 *
 * Comportement :
 *   - `addItem(watch)` → ajoute une ligne {watch, quantity: 1}, ou incrémente
 *     la quantité si la montre est déjà au panier
 *   - `removeItem(id)` → retire toutes les lignes de cette montre
 *   - `clear()` → vide le panier
 *   - `totalItems` / `totalPrice` sont calculés à partir de `items`
 */
export function useCart(): UseCart {
  const items = ref<CartItem[]>([]);

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0));
  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.watch.priceEur * item.quantity, 0));

  function addItem(watch: Watch): void {
    const existing = items.value.find((item) => item.watch.id === watch.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      items.value.push({ watch, quantity: 1 });
    }
  }

  function removeItem(watchId: number): void {
    items.value = items.value.filter((item) => item.watch.id !== watchId);
  }

  function clear(): void {
    items.value = [];
  }

  return { items, totalItems, totalPrice, addItem, removeItem, clear };
}
