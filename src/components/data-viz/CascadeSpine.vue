<script setup lang="ts">
import { LAYER_META } from '../../constants/layerMeta';
import type { LayerId } from '../../types/spaceWeather';

defineProps<{
  activeLayer?: LayerId | null;
}>();

const emit = defineEmits<{
  navigate: [id: LayerId];
}>();

function scrollTo(id: LayerId) {
  emit('navigate', id);
}
</script>

<template>
  <nav class="cascade-spine" aria-label="Atmospheric layers">
    <span class="cascade-spine__label">Layers</span>
    <ol class="cascade-spine__list">
      <li v-for="layer in LAYER_META" :key="layer.id">
        <button
          type="button"
          class="cascade-spine__item"
          :class="{ 'cascade-spine__item--active': activeLayer === layer.id }"
          @click="scrollTo(layer.id)"
        >
          {{ layer.title }}
        </button>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.cascade-spine {
  position: sticky;
  top: calc(var(--site-header-height) + 0.5rem);
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1rem;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  background: rgba(15, 17, 23, 0.92);
  border: 1px solid var(--dash-border);
  border-radius: var(--site-radius);
  backdrop-filter: blur(8px);
}

.cascade-spine__label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--dash-muted);
}

.cascade-spine__list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.cascade-spine__item {
  padding: 0.375rem 0.75rem;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  font-family: var(--site-font);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--dash-text-secondary);
  cursor: pointer;
  transition:
    color var(--site-transition),
    background var(--site-transition),
    border-color var(--site-transition);
}

.cascade-spine__item:hover {
  color: var(--dash-text);
  border-color: var(--dash-border);
}

.cascade-spine__item--active {
  color: #fff;
  background: var(--dash-accent);
  border-color: var(--dash-accent);
}
</style>
