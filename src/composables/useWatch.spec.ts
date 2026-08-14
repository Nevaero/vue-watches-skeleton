import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, ref, type Ref } from 'vue';
import { mount } from '@vue/test-utils';
import { useWatch } from './useWatch';
import * as api from '../api/watches';
import type { Watch } from '../types';

vi.mock('../api/watches');

const rolex: Watch = { id: 1, brand: 'Rolex', model: 'Submariner', priceEur: 12000, stock: 3 };
const omega: Watch = { id: 2, brand: 'Omega', model: 'Speedmaster', priceEur: 6500, stock: 5 };

function withSetup(id: Ref<number>): { result: ReturnType<typeof useWatch> } {
  const captured = {} as { result: ReturnType<typeof useWatch> };
  mount(
    defineComponent({
      setup() {
        captured.result = useWatch(id);
        return () => h('div');
      },
    }),
  );
  return captured;
}

async function flushPromises(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
}

describe('useWatch', () => {
  beforeEach(() => {
    vi.mocked(api.getWatch).mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initialise watch=null, loading=true, error=null', () => {
    vi.mocked(api.getWatch).mockReturnValue(new Promise(() => {})); // ne résout jamais
    const { result } = withSetup(ref(1));
    expect(result.watch.value).toBeNull();
    expect(result.loading.value).toBe(true);
    expect(result.error.value).toBeNull();
  });

  it('charge la montre au montage et passe loading=false', async () => {
    vi.mocked(api.getWatch).mockResolvedValue(rolex);
    const { result } = withSetup(ref(1));

    await flushPromises();

    expect(api.getWatch).toHaveBeenCalledWith(1);
    expect(result.watch.value).toEqual(rolex);
    expect(result.loading.value).toBe(false);
    expect(result.error.value).toBeNull();
  });

  it("expose le message d'erreur si le chargement échoue", async () => {
    vi.mocked(api.getWatch).mockRejectedValue(new Error('not found'));
    const { result } = withSetup(ref(99));

    await flushPromises();

    expect(result.error.value).toBe('not found');
    expect(result.watch.value).toBeNull();
    expect(result.loading.value).toBe(false);
  });

  it('relance le chargement quand id change', async () => {
    vi.mocked(api.getWatch).mockResolvedValue(rolex);
    const id = ref(1);
    const { result } = withSetup(id);
    await flushPromises();
    expect(api.getWatch).toHaveBeenCalledWith(1);

    vi.mocked(api.getWatch).mockResolvedValue(omega);
    id.value = 2;
    await flushPromises();

    expect(api.getWatch).toHaveBeenCalledWith(2);
    expect(result.watch.value).toEqual(omega);
  });
});
