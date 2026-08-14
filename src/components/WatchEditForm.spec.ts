import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import WatchEditForm from './WatchEditForm.vue';
import * as api from '../api/watches';
import type { Watch } from '../types';

vi.mock('../api/watches');

const rolex: Watch = { id: 1, brand: 'Rolex', model: 'Submariner', priceEur: 12000, stock: 3 };

function mountForm() {
  return mount(WatchEditForm, { props: { initial: rolex } });
}

describe('WatchEditForm', () => {
  beforeEach(() => {
    vi.mocked(api.updateWatch).mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rend deux inputs nombres pré-remplis avec priceEur et stock', () => {
    const wrapper = mountForm();
    expect(wrapper.get('[aria-label="Prix"]').element).toHaveProperty('value', '12000');
    expect(wrapper.get('[aria-label="Stock"]').element).toHaveProperty('value', '3');
  });

  it('désactive le bouton tant que rien n\'est modifié', () => {
    const wrapper = mountForm();
    expect(wrapper.get('button').attributes('disabled')).toBeDefined();
  });

  it('active le bouton dès qu\'un champ change', async () => {
    const wrapper = mountForm();
    await wrapper.get('[aria-label="Prix"]').setValue('13500');
    expect(wrapper.get('button').attributes('disabled')).toBeUndefined();
  });

  it('appelle updateWatch et émet saved au submit', async () => {
    const updated = { ...rolex, priceEur: 13500 };
    vi.mocked(api.updateWatch).mockResolvedValue(updated);

    const wrapper = mountForm();
    await wrapper.get('[aria-label="Prix"]').setValue('13500');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(api.updateWatch).toHaveBeenCalledWith(1, { priceEur: 13500, stock: 3 });
    expect(wrapper.emitted('saved')).toBeTruthy();
    expect(wrapper.emitted('saved')![0]).toEqual([updated]);
  });

  it('passe en état "Enregistrement…" et désactive le bouton pendant la soumission', async () => {
    let resolveUpdate!: (w: Watch) => void;
    vi.mocked(api.updateWatch).mockReturnValue(
      new Promise<Watch>((resolve) => {
        resolveUpdate = resolve;
      }),
    );

    const wrapper = mountForm();
    await wrapper.get('[aria-label="Prix"]').setValue('13500');
    await wrapper.get('form').trigger('submit');

    expect(wrapper.get('button').text()).toMatch(/enregistrement/i);
    expect(wrapper.get('button').attributes('disabled')).toBeDefined();

    resolveUpdate({ ...rolex, priceEur: 13500 });
    await flushPromises();

    expect(wrapper.get('button').text()).toMatch(/^Enregistrer$/);
  });

  it("affiche le message d'erreur en cas d'échec", async () => {
    vi.mocked(api.updateWatch).mockRejectedValue(new Error('priceEur must be >= 0'));

    const wrapper = mountForm();
    await wrapper.get('[aria-label="Prix"]').setValue('-1');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(wrapper.get('[role="alert"]').text()).toBe('priceEur must be >= 0');
  });

  it("n'émet pas saved en cas d'erreur et réactive le bouton", async () => {
    vi.mocked(api.updateWatch).mockRejectedValue(new Error('boom'));

    const wrapper = mountForm();
    await wrapper.get('[aria-label="Stock"]').setValue('0');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(api.updateWatch).toHaveBeenCalled();
    expect(wrapper.emitted('saved')).toBeFalsy();
    // Le `finally` : sans lui, le bouton resterait bloqué sur "Enregistrement…".
    expect(wrapper.get('button').attributes('disabled')).toBeUndefined();
  });
});
