import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import WatchCard from './WatchCard.vue';
import type { Watch } from '../types';

const inStock: Watch = { id: 1, brand: 'Rolex', model: 'Submariner', priceEur: 12000, stock: 3 };
const soldOut: Watch = { id: 2, brand: 'Patek Philippe', model: 'Nautilus', priceEur: 45000, stock: 0 };

describe('WatchCard', () => {
  it('affiche la marque dans un <h3>', () => {
    const wrapper = mount(WatchCard, { props: { watch: inStock } });
    expect(wrapper.get('h3').text()).toBe('Rolex');
  });

  it('affiche le modèle dans un <p>', () => {
    const wrapper = mount(WatchCard, { props: { watch: inStock } });
    expect(wrapper.get('p').text()).toBe('Submariner');
  });

  it('affiche le prix formaté dans data-testid="price"', () => {
    const wrapper = mount(WatchCard, { props: { watch: inStock } });
    expect(wrapper.get('[data-testid="price"]').text()).toBe('12 000 €');
  });

  it('émet addToCart(watch) au clic sur le bouton quand le stock est > 0', async () => {
    const wrapper = mount(WatchCard, { props: { watch: inStock } });
    const button = wrapper.get('button');
    expect(button.text()).toMatch(/ajouter au panier/i);
    expect(button.attributes('disabled')).toBeUndefined();

    await button.trigger('click');
    const emitted = wrapper.emitted('addToCart');
    expect(emitted).toBeDefined();
    expect(emitted!).toHaveLength(1);
    expect(emitted![0]).toEqual([inStock]);
  });

  it('désactive le bouton et affiche "Rupture" quand stock = 0', async () => {
    const wrapper = mount(WatchCard, { props: { watch: soldOut } });
    const button = wrapper.get('button');
    expect(button.text()).toMatch(/rupture/i);
    expect(button.attributes('disabled')).toBeDefined();

    await button.trigger('click');
    expect(wrapper.emitted('addToCart')).toBeUndefined();
  });
});
