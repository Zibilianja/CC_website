<script setup lang="ts">
defineProps<{
  label?: string;
}>();
</script>

<template>
  <details class="layer-details">
    <summary class="layer-details__summary">
      {{ label ?? 'View source data' }}
    </summary>
    <div class="layer-details__content">
      <slot />
    </div>
  </details>
</template>

<style scoped>
.layer-details {
  border: 1px solid var(--dash-border);
  border-radius: var(--site-radius);
  background: var(--dash-surface);
}

.layer-details__summary {
  padding: 0.75rem 1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--dash-muted);
  cursor: pointer;
  user-select: none;
  list-style: none;
}

.layer-details__summary::-webkit-details-marker {
  display: none;
}

.layer-details__summary::before {
  content: '▸ ';
  display: inline-block;
  transition: transform 0.15s ease;
}

.layer-details[open] .layer-details__summary::before {
  transform: rotate(90deg);
}

.layer-details__summary:hover {
  color: var(--dash-text-secondary);
}

.layer-details__content {
  padding: 0 1rem 1rem;
  border-top: 1px solid var(--dash-border);
}
</style>
