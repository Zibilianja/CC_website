<script setup lang="ts">
defineProps<{
  title: string;
  emptyText?: string;
}>();

defineSlots<{
  default(): unknown;
}>();
</script>

<template>
  <div class="data-table card">
    <h4 class="data-table__title">{{ title }}</h4>
    <div class="data-table__body">
      <slot>
        <p class="data-table__empty">{{ emptyText ?? 'No data available.' }}</p>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.data-table {
  padding: 1rem 1.125rem;
  background: var(--dash-surface);
  border-color: var(--dash-border);
}

.data-table__title {
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--dash-text);
}

.data-table__body {
  font-size: 0.875rem;
}

.data-table__empty {
  color: var(--dash-muted);
  font-size: 0.875rem;
}

:deep(table) {
  width: 100%;
  border-collapse: collapse;
}

:deep(th),
:deep(td) {
  padding: 0.5rem 0.25rem;
  text-align: left;
  border-bottom: 1px solid var(--dash-border);
  vertical-align: top;
}

:deep(th) {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--dash-muted);
}

:deep(tr:last-child td) {
  border-bottom: none;
}

:deep(td) {
  color: var(--dash-text-secondary);
}

:deep(.severity--high) {
  color: var(--dash-danger);
  font-weight: 600;
}
</style>
