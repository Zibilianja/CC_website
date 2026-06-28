<script setup lang="ts">
import type { LayerNarrative } from '../../utils/layerNarratives';

defineProps<{
  narrative: LayerNarrative;
}>();
</script>

<template>
  <div class="insight" :class="`insight--${narrative.tone}`">
    <h3 class="insight__headline">{{ narrative.headline }}</h3>
    <p class="insight__body">{{ narrative.body }}</p>
  </div>
</template>

<style scoped>
.insight {
  padding: 1.25rem 1.375rem;
  border-radius: var(--site-radius);
  border: 1px solid var(--dash-border);
  background: var(--dash-surface);
}

.insight--calm {
  border-left: 3px solid var(--dash-success);
}

.insight--watch {
  border-left: 3px solid #fbbf24;
}

.insight--alert {
  border-left: 3px solid var(--dash-danger);
}

.insight--neutral {
  border-left: 3px solid var(--dash-accent);
}

.insight__headline {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--dash-text);
  margin-bottom: 0.5rem;
}

.insight__body {
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--dash-text-secondary);
}
</style>
