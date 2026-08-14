<script setup lang="ts">
import WatchCard from './components/WatchCard.vue';
import { useCart } from './composables/useCart';
import { useWatches } from './composables/useWatches';
import { formatPriceEur } from './utils/price';

const { watches, loading, error, reload } = useWatches();
const { addItem, clear: clearCart, totalItems, totalPrice } = useCart();
</script>

<template>
  <main>
    <h1>Montres de luxe</h1>

    <p v-if="loading">Chargement…</p>

    <p v-else-if="error" class="error">
      Erreur : {{ error }}
      <button @click="reload">Réessayer</button>
    </p>

    <section v-else class="grid">
      <WatchCard
        v-for="w in watches"
        :key="w.id"
        :watch="w"
        @add-to-cart="addItem"
      />
    </section>

    <aside>
      <h2>Panier ({{ totalItems }}), {{ formatPriceEur(totalPrice) }}</h2>
      <button :disabled="totalItems === 0" @click="clearCart">Vider</button>
    </aside>
  </main>
</template>

<style scoped>
main {
  font-family: system-ui, sans-serif;
  padding: 24px;
}
.error {
  color: crimson;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}
aside {
  margin-top: 32px;
}
</style>
