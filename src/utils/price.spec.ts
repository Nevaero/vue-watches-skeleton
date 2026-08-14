import { describe, expect, it } from 'vitest';
import { calculateCartTotal, formatPriceEur } from './price';
import type { Watch } from '../types';

const rolex: Watch = { id: 1, brand: 'Rolex', model: 'Submariner', priceEur: 12000, stock: 3 };
const omega: Watch = { id: 2, brand: 'Omega', model: 'Speedmaster', priceEur: 6500, stock: 5 };

describe('formatPriceEur', () => {
  it('formate un nombre court sans séparateur', () => {
    expect(formatPriceEur(500)).toBe('500 €');
  });

  it('formate un nombre à 4 chiffres avec un séparateur', () => {
    expect(formatPriceEur(6500)).toBe('6 500 €');
  });

  it('formate un nombre à 5 chiffres', () => {
    expect(formatPriceEur(12000)).toBe('12 000 €');
  });

  it('formate un nombre à 6 chiffres', () => {
    expect(formatPriceEur(450000)).toBe('450 000 €');
  });

  it('gère 0', () => {
    expect(formatPriceEur(0)).toBe('0 €');
  });
});

describe('calculateCartTotal', () => {
  it('retourne 0 pour un panier vide', () => {
    expect(calculateCartTotal([])).toBe(0);
  });

  it('somme prix x quantité de toutes les lignes', () => {
    const total = calculateCartTotal([
      { watch: rolex, quantity: 2 },
      { watch: omega, quantity: 1 },
    ]);
    expect(total).toBe(2 * 12000 + 6500);
  });

  it('gère une seule ligne avec quantité 1', () => {
    expect(calculateCartTotal([{ watch: rolex, quantity: 1 }])).toBe(12000);
  });
});
