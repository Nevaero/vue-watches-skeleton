import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { useCart } from './useCart';
import type { Watch } from '../types';

const rolex: Watch = { id: 1, brand: 'Rolex', model: 'Submariner', priceEur: 12000, stock: 3 };
const omega: Watch = { id: 2, brand: 'Omega', model: 'Speedmaster', priceEur: 6500, stock: 5 };

function withSetup(): { cart: ReturnType<typeof useCart> } {
  const captured = {} as { cart: ReturnType<typeof useCart> };
  mount(
    defineComponent({
      setup() {
        captured.cart = useCart();
        return () => h('div');
      },
    }),
  );
  return captured;
}

describe('useCart', () => {
  it('panier vide au démarrage', () => {
    const { cart } = withSetup();
    expect(cart.items.value).toEqual([]);
    expect(cart.totalItems.value).toBe(0);
    expect(cart.totalPrice.value).toBe(0);
  });

  it('addItem ajoute une nouvelle ligne avec quantity=1', () => {
    const { cart } = withSetup();
    cart.addItem(rolex);
    expect(cart.items.value).toHaveLength(1);
    expect(cart.items.value[0]).toEqual({ watch: rolex, quantity: 1 });
    expect(cart.totalItems.value).toBe(1);
    expect(cart.totalPrice.value).toBe(12000);
  });

  it('addItem incrémente la quantité si la montre est déjà au panier', () => {
    const { cart } = withSetup();
    cart.addItem(rolex);
    cart.addItem(rolex);
    expect(cart.items.value).toHaveLength(1);
    expect(cart.items.value[0].quantity).toBe(2);
    expect(cart.totalItems.value).toBe(2);
    expect(cart.totalPrice.value).toBe(2 * 12000);
  });

  it('removeItem retire la ligne par id', () => {
    const { cart } = withSetup();
    cart.addItem(rolex);
    cart.addItem(omega);
    cart.removeItem(rolex.id);
    expect(cart.items.value).toHaveLength(1);
    expect(cart.items.value[0].watch.id).toBe(omega.id);
  });

  it('clear vide le panier', () => {
    const { cart } = withSetup();
    cart.addItem(rolex);
    cart.addItem(omega);
    cart.clear();
    expect(cart.items.value).toEqual([]);
    expect(cart.totalItems.value).toBe(0);
  });
});
