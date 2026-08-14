<script setup lang="ts">
import { computed, ref } from 'vue';
import { updateWatch } from '../api/watches';
import type { Watch } from '../types';

const props = defineProps<{ initial: Watch }>();
const emit = defineEmits<{ saved: [watch: Watch] }>();

const priceEur = ref(props.initial.priceEur);
const stock = ref(props.initial.stock);
const submitting = ref(false);
const error = ref<string | null>(null);

const isDirty = computed(
  () => priceEur.value !== props.initial.priceEur || stock.value !== props.initial.stock);

/**
 * Attendu : soumission du formulaire d'édition.
 *
 * Tout le reste du composant est déjà câblé : les deux inputs et leur
 * `v-model.number`, le calcul de `isDirty`, l'état désactivé du bouton, son
 * libellé, et l'affichage du `<p role="alert">`. Vous ne remplissez que le
 * corps de cette fonction ; les refs qu'elle doit piloter existent déjà.
 *
 * Comportement (vérifié par WatchEditForm.spec.ts) :
 *   1. passer `submitting` à true et remettre `error` à null ;
 *   2. appeler `updateWatch(props.initial.id, { priceEur, stock })`, avec les
 *      valeurs courantes des refs, donc leurs `.value` ;
 *   3. succès → émettre `saved` avec la montre retournée : `emit('saved', updated)` ;
 *   4. échec  → renseigner `error` avec le `message` de l'exception, et n'émettre
 *      rien ;
 *   5. dans les deux cas, `submitting` repasse à false.
 *
 * L'étape 5 est testée : sans elle, le bouton reste bloqué sur
 * « Enregistrement… » après une erreur. Un `finally` s'en charge d'un coup.
 */
async function onSubmit(): Promise<void> {
  // TODO : voir le comportement attendu ci-dessus.
  throw new Error('TODO: implémenter WatchEditForm.onSubmit');
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <label>
      Prix (€)
      <input v-model.number="priceEur" type="number" aria-label="Prix" />
    </label>
    <label>
      Stock
      <input v-model.number="stock" type="number" aria-label="Stock" />
    </label>
    <button type="submit" :disabled="!isDirty || submitting">
      {{ submitting ? 'Enregistrement…' : 'Enregistrer' }}
    </button>
    <p v-if="error" role="alert">{{ error }}</p>
  </form>
</template>

<style scoped>
form {
  display: grid;
  gap: 8px;
  max-width: 320px;
}
p[role='alert'] {
  color: crimson;
}
</style>
