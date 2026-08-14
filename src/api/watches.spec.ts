import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getWatch, updateWatch } from './watches';
import type { Watch } from '../types';

const rolex: Watch = { id: 1, brand: 'Rolex', model: 'Submariner', priceEur: 12000, stock: 3 };

/**
 * Ici on ne mocke PAS le module `./watches` : on remplace `fetch` pour
 * vérifier la requête réellement émise (méthode, URL, en-têtes, body) et le
 * traitement de la réponse.
 */
function mockFetch(response: {
  ok: boolean;
  status?: number;
  json?: () => Promise<unknown>;
}): ReturnType<typeof vi.fn> {
  const fn = vi.fn().mockResolvedValue({
    ok: response.ok,
    status: response.status ?? (response.ok ? 200 : 500),
    json: response.json ?? (() => Promise.resolve(rolex)),
  });
  vi.stubGlobal('fetch', fn);
  return fn;
}

describe('getWatch', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('appelle GET sur /watches/{id} et renvoie la montre', async () => {
    const fetchMock = mockFetch({ ok: true });

    await expect(getWatch(1)).resolves.toEqual(rolex);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit | undefined];
    expect(url).toMatch(/\/watches\/1$/);
    // GET : soit pas de second argument, soit une méthode explicite GET.
    expect(init?.method ?? 'GET').toBe('GET');
  });

  it('lève une erreur quand la réponse est en échec', async () => {
    const fetchMock = mockFetch({ ok: false, status: 404 });
    await expect(getWatch(99)).rejects.toThrow();
    // La requête doit avoir été émise : une fonction qui échoue sans appeler
    // fetch ne satisfait pas le contrat.
    expect(fetchMock).toHaveBeenCalled();
  });
});

describe('updateWatch', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('envoie un PATCH avec le body JSON partiel', async () => {
    const fetchMock = mockFetch({ ok: true });

    await updateWatch(1, { priceEur: 13500 });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toMatch(/\/watches\/1$/);
    expect(init.method).toBe('PATCH');
    expect(JSON.parse(init.body as string)).toEqual({ priceEur: 13500 });
  });

  it('déclare le Content-Type application/json', async () => {
    const fetchMock = mockFetch({ ok: true });

    await updateWatch(1, { stock: 0 });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Record<string, string>;
    expect(headers['Content-Type']).toBe('application/json');
  });

  it('renvoie la montre mise à jour', async () => {
    const updated = { ...rolex, priceEur: 13500 };
    mockFetch({ ok: true, json: () => Promise.resolve(updated) });

    await expect(updateWatch(1, { priceEur: 13500 })).resolves.toEqual(updated);
  });

  it("remonte le message d'erreur du backend quand il y en a un", async () => {
    mockFetch({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: 'stock must be >= 0, got -1' }),
    });

    await expect(updateWatch(1, { stock: -1 })).rejects.toThrow('stock must be >= 0, got -1');
  });

  it('retombe sur un message générique quand le body d\'erreur n\'est pas exploitable', async () => {
    mockFetch({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error('not json')),
    });

    await expect(updateWatch(1, { stock: 1 })).rejects.toThrow(/500/);
  });
});
