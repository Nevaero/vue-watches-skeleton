import { onMounted, ref, watch as watchSource, type Ref } from 'vue';
import { getWatch } from '../api/watches';
import type { Watch } from '../types';

export type UseWatch = {
  watch: Ref<Watch | null>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
};

/**
 * Attendu : composable qui charge UNE montre par id depuis l'API.
 *
 * État initial (vérifié par useWatch.spec.ts) :
 *   watch = null, loading = true, error = null.
 *
 * Au montage : appelle `getWatch(id.value)`.
 *   - succès → renseigne `watch`, passe `loading` à false, `error` reste null ;
 *   - échec  → renseigne `error` avec le `message` de l'exception, `watch`
 *              reste null, `loading` passe à false.
 *
 * Quand la ref `id` change, le chargement est relancé avec le nouvel id.
 *
 * Comparez avec `useWatches.ts` juste à côté : c'est la même mécanique, à trois
 * différences près, une seule montre au lieu d'une liste, l'id vient d'une ref,
 * et il faut réagir à ses changements.
 *
 * Indices :
 *   - `onMounted(load)` déclenche le premier chargement ;
 *   - `watchSource(id, load)` relance `load` quand `id` change (l'import est
 *     renommé pour ne pas entrer en collision avec la ref `watch` ci-dessous) ;
 *   - `try / catch / finally` : le `finally` est ce qui garantit que `loading`
 *     repasse à false même en cas d'erreur ;
 *   - n'oubliez pas les `.value`, l'auto-unwrapping ne joue que dans le template.
 */
export function useWatch(id: Ref<number>): UseWatch {
  const watch = ref<Watch | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  async function load(): Promise<void> {
    // TODO : remettez loading à true, error à null, watch à null,
    //        puis chargez la montre via getWatch(id.value).
    //        Succès → watch.value = ... ; échec → error.value = ... ;
    //        dans tous les cas → loading.value = false.
    throw new Error('TODO: implémenter useWatch');
  }

  onMounted(load);
  watchSource(id, load);

  return { watch, loading, error };
}
