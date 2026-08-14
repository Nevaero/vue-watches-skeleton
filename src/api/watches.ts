import type { Watch } from '../types';

/**
 * URL de base de l'API. Conforme à `API.md` ; pointe par défaut sur le backend
 * Spring (`localhost:8080`). Pour viser un autre backend (NestJS sur :3000,
 * Django sur :8000), modifie cette constante ou exporte `VITE_API_URL`
 * avant `npm run dev` (Vite injecte les variables `VITE_*` dans `import.meta.env`).
 */
const API_URL =
  ((import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL) ??
  'http://localhost:8080/api';

export async function fetchWatches(): Promise<Watch[]> {
  const response = await fetch(`${API_URL}/watches`);
  if (!response.ok) {
    throw new Error(`Failed to load watches (HTTP ${response.status})`);
  }
  return response.json() as Promise<Watch[]>;
}

export async function purchaseWatch(id: number, quantity: number): Promise<Watch> {
  const response = await fetch(`${API_URL}/watches/${id}/purchase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  if (!response.ok) {
    throw new Error(`Failed to purchase (HTTP ${response.status})`);
  }
  return response.json() as Promise<Watch>;
}

/**
 * Attendu : récupère UNE montre par son id.
 *
 *   GET {API_URL}/watches/{id}
 *   succès → renvoie le JSON désérialisé en Watch
 *   échec  → throw new Error(...) avec un message explicite
 *
 * Vérifié par watches.spec.ts, qui remplace `fetch` et inspecte l'appel réel.
 *
 * Indice : calquez `fetchWatches` ci-dessus, avec le bon chemin.
 */
export async function getWatch(id: number): Promise<Watch> {
  // TODO : voir Indice ci-dessus.
  throw new Error('TODO: implémenter getWatch');
}

export type WatchUpdate = {
  priceEur?: number;
  stock?: number;
};

/**
 * Attendu : applique une mise à jour partielle sur la montre `id`.
 *
 *   PATCH {API_URL}/watches/{id}
 *   Content-Type: application/json
 *   body: JSON.stringify(partial)
 *   succès → renvoie le JSON désérialisé en Watch (la montre mise à jour)
 *   échec  → lit le body d'erreur (`{ error: "..." }`, cf. API.md) et lève une
 *            Error portant ce message ; si le body n'est pas exploitable,
 *            retombe sur `Update failed (HTTP <status>)`.
 *
 * Vérifié par watches.spec.ts, qui inspecte la méthode HTTP, l'en-tête
 * Content-Type, le body envoyé, et les deux cas d'erreur.
 *
 * Indice : calquez `purchaseWatch` ci-dessus, mais en `PATCH` au lieu de
 * `POST`.
 *
 * La subtilité est là : la lecture du body d'erreur doit tolérer une réponse
 * qui n'est pas du JSON. Neutralisez donc l'échec de désérialisation avant de
 * retomber sur le message générique.
 */
export async function updateWatch(id: number, partial: WatchUpdate): Promise<Watch> {
  // TODO : voir Indice ci-dessus.
  throw new Error('TODO: implémenter updateWatch');
}
