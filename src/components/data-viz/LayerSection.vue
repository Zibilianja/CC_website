<script setup lang="ts">
import type { LayerMeta } from '../../types/spaceWeather';

defineProps<{
  meta: LayerMeta;
  layerIndex: number;
}>();
</script>

<template>
  <section :id="meta.id" class="layer-section">
    <div class="layer-section__header">
      <div class="layer-section__marker">
        <span class="layer-section__index">{{ layerIndex }}</span>
        <span class="layer-section__line" aria-hidden="true" />
      </div>
      <div class="layer-section__titles">
        <p class="layer-section__altitude">{{ meta.altitude }}</p>
        <h2 class="layer-section__title">{{ meta.title }}</h2>
        <p class="layer-section__summary">{{ meta.summary }}</p>
      </div>
    </div>
    <div class="layer-section__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.layer-section {
  position: relative;
  padding: 2rem 0;
  scroll-margin-top: calc(var(--site-header-height) + 4.5rem);
}

.layer-section + .layer-section {
  border-top: 1px solid var(--dash-border);
}

.layer-section__header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.25rem;
  align-items: start;
  margin-bottom: 1.5rem;
}

.layer-section__marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.25rem;
}

.layer-section__index {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--dash-accent);
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 700;
}

.layer-section__line {
  width: 2px;
  flex: 1;
  min-height: 2rem;
  background: linear-gradient(
    to bottom,
    var(--dash-accent),
    transparent
  );
}

.layer-section:last-child .layer-section__line {
  display: none;
}

.layer-section__altitude {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--dash-accent);
  margin-bottom: 0.375rem;
}

.layer-section__title {
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  color: var(--dash-text);
}

.layer-section__summary {
  margin-top: 0.5rem;
  font-size: 0.9375rem;
  color: var(--dash-text-secondary);
  max-width: 60ch;
}

@media (max-width: 640px) {
  .layer-section__header {
    grid-template-columns: auto 1fr;
  }
}
</style>
