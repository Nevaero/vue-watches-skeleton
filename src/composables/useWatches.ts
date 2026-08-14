import { onMounted, ref, type Ref } from 'vue';
import { fetchWatches } from '../api/watches';
import type { Watch } from '../types';

export type UseWatches = {
  watches: Ref<Watch[]>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  reload: () => void;
};

/**
 * Composable qui charge la liste des montres depuis l'API au montage.
 *
 * État initial attendu (vérifié par useWatches.spec.ts) :
 *   watches.value = [], loading.value = true, error.value = null.
 *
 * Au montage : appelle `fetchWatches()`. En cas de succès → met `watches.value`
 * et passe `loading.value` à false. En cas d'échec → met `error.value` au
 * `message` de l'exception et passe `loading.value` à false.
 *
 * `reload()` doit relancer le fetch en réinitialisant `loading` et `error`.
 *
 * Indices :
 *   - 3 `ref()` : `watches` (Watch[]), `loading` (bool), `error` (string|null)
 *   - une fonction `load()` qui set `loading.value = true`, `error.value = null`,
 *     puis appelle `fetchWatches()` et bascule selon succès/échec
 *   - `onMounted(load)` déclenche le chargement initial
 *   - `reload` est juste un alias public de `load`
 *   - retourne les `Ref`, pas leurs `.value` (la réactivité passe par la ref)
 */
export function useWatches(): UseWatches {
  // TODO : voir Indices ci-dessus.
  throw new Error('TODO: implémenter useWatches');
}
