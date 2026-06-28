<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
}>();
</script>

<template>
  <div class="metric">
    <span class="metric__label">{{ label }}</span>
    <span class="metric__value">
      {{ value }}
      <small v-if="unit" class="metric__unit">{{ unit }}</small>
    </span>
    <span v-if="hint" class="metric__hint">{{ hint }}</span>
  </div>
</template>

<style scoped>
.metric {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem 1.125rem;
  background: var(--dash-surface);
  border: 1px solid var(--dash-border);
  border-radius: var(--site-radius);
}

.metric__label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--dash-muted);
}

.metric__value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--dash-text);
  line-height: 1.2;
}

.metric__unit {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--dash-muted);
  margin-left: 0.25rem;
}

.metric__hint {
  font-size: 0.8125rem;
  color: var(--dash-muted);
}
</style>
