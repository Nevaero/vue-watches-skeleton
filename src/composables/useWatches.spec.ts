import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { useWatches } from './useWatches';
import * as api from '../api/watches';
import type { Watch } from '../types';

vi.mock('../api/watches');

const sample: Watch[] = [
  { id: 1, brand: 'Rolex', model: 'Submariner', priceEur: 12000, stock: 3 },
];

/**
 * Monte un composant minimal qui invoque `useWatches()` dans son setup et
 * expose son retour via la variable `result`. C'est l'idiome officiel Vue 3
 * pour tester les composables qui utilisent des hooks de cycle de vie
 * (`onMounted`).
 */
function withSetup(): { result: ReturnType<typeof useWatches> } {
  const captured = {} as { result: ReturnType<typeof useWatches> };
  mount(
    defineComponent({
      setup() {
        captured.result = useWatches();
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

describe('useWatches', () => {
  beforeEach(() => {
    vi.mocked(api.fetchWatches).mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initialise loading=true, watches=[], error=null', () => {
    vi.mocked(api.fetchWatches).mockReturnValue(new Promise(() => {})); // ne résout jamais
    const { result } = withSetup();
    expect(result.watches.value).toEqual([]);
    expect(result.loading.value).toBe(true);
    expect(result.error.value).toBeNull();
  });

  it('charge les montres au montage et passe loading=false', async () => {
    vi.mocked(api.fetchWatches).mockResolvedValue(sample);
    const { result } = withSetup();
    await flushPromises();
    expect(result.watches.value).toEqual(sample);
    expect(result.loading.value).toBe(false);
    expect(result.error.value).toBeNull();
  });

  it("expose le message d'erreur si fetch échoue", async () => {
    vi.mocked(api.fetchWatches).mockRejectedValue(new Error('boom'));
    const { result } = withSetup();
    await flushPromises();
    expect(result.error.value).toBe('boom');
    expect(result.loading.value).toBe(false);
    expect(result.watches.value).toEqual([]);
  });

  it('reload() relance le fetch', async () => {
    vi.mocked(api.fetchWatches).mockResolvedValue(sample);
    const { result } = withSetup();
    await flushPromises();
    expect(api.fetchWatches).toHaveBeenCalledTimes(1);

    vi.mocked(api.fetchWatches).mockClear();
    vi.mocked(api.fetchWatches).mockResolvedValue(sample);
    result.reload();
    await flushPromises();
    expect(api.fetchWatches).toHaveBeenCalledTimes(1);
  });
});
