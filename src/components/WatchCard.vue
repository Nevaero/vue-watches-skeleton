<script setup lang="ts">
import { computed } from 'vue';
import type { Watch } from '../types';
import { formatPriceEur } from '../utils/price';

/**
 * Composant carte d'une montre.
 *
 * Le squelette pose la classe avec ses props/emits/computed (`watch`,
 * `addToCart`, `outOfStock`, `formattedPrice`) et `onAdd()`. Tu n'as qu'à
 * compléter les emplacements `TODO` dans le `<template>` ci-dessous.
 *
 * Comportement attendu (vérifié par WatchCard.spec.ts) :
 *
 *   - le `<h3>` contient `watch.brand` ("Rolex", …)
 *   - le `<p>` contient `watch.model` ("Submariner", …)
 *   - l'élément `data-testid="price"` contient `formatPriceEur(watch.priceEur)`
 *   - le `<button>` :
 *       - si la montre est en stock  → texte "Ajouter au panier",
 *                                       au clic émet `addToCart` avec la montre
 *       - si elle est en rupture     → texte "Rupture", attribut `disabled`
 *
 * Indices Vue 3 :
 *   - dans `<script setup>`, les `defineProps` / `defineEmits` sont des macros
 *     compile-time : leur retour est utilisable directement (`props.watch`).
 *   - en template, l'interpolation `{{ … }}` accède aux variables du `<script setup>`
 *     SANS le préfixe `props.` (Vue les "déballe" automatiquement).
 *   - pour le `disabled`, utilise un binding `:disabled="…"` ; pour le label,
 *     un ternaire `{{ outOfStock ? 'Rupture' : 'Ajouter au panier' }}`.
 */

const props = defineProps<{ watch: Watch }>();
const emit = defineEmits<{ addToCart: [watch: Watch] }>();

const outOfStock = computed(() => props.watch.stock === 0);
const formattedPrice = computed(() => formatPriceEur(props.watch.priceEur));

function onAdd(): void {
  if (!outOfStock.value) {
    emit('addToCart', props.watch);
  }
}
</script>

<template>
  <article>
    <h3><!-- TODO : marque (watch.brand) --></h3>
    <p><!-- TODO : modèle (watch.model) --></p>
    <span data-testid="price">
      <!-- TODO : prix formaté (formattedPrice) -->
    </span>
    <button
      :disabled="false"
      @click="onAdd"
    >
      <!-- TODO : "Rupture" si outOfStock, sinon "Ajouter au panier".
           Pense à passer :disabled="outOfStock" sur le bouton ci-dessus. -->
    </button>
  </article>
</template>

<style scoped>
article {
  display: block;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>
