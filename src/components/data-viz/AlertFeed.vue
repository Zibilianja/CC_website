<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { WeatherAlert } from '../../types/spaceWeather';

const props = defineProps<{
  alerts: WeatherAlert[];
}>();

const activeIndex = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

const active = computed(() => props.alerts[activeIndex.value] ?? null);

function severityClass(severity: string) {
  const s = severity.toLowerCase();
  if (s === 'extreme') return 'alert-card--extreme';
  if (s === 'severe') return 'alert-card--severe';
  if (s === 'moderate') return 'alert-card--moderate';
  return 'alert-card--minor';
}

onMounted(() => {
  if (props.alerts.length <= 1) return;
  timer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % props.alerts.length;
  }, 5000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div class="viz-card">
    <div class="viz-card__header">
      <h4>US severe weather alerts</h4>
      <p v-if="alerts.length">{{ alerts.length }} active — cycling every 5s</p>
      <p v-else>No active alerts</p>
    </div>

    <div v-if="active" class="alert-stage">
      <article class="alert-card" :class="severityClass(active.severity)">
        <p class="alert-card__event">{{ active.event }}</p>
        <p class="alert-card__severity">{{ active.severity }}</p>
        <p class="alert-card__area">{{ active.area }}</p>
        <p class="alert-card__headline">{{ active.headline }}</p>
      </article>
    </div>

    <div v-if="alerts.length > 1" class="alert-dots">
      <button
        v-for="(_, i) in alerts"
        :key="i"
        type="button"
        class="alert-dot"
        :class="{ 'alert-dot--active': i === activeIndex }"
        :aria-label="`Alert ${i + 1}`"
        @click="activeIndex = i"
      />
    </div>
  </div>
</template>

<style scoped>
.viz-card {
  border: 1px solid var(--dash-border);
  border-radius: var(--site-radius);
  background: var(--dash-surface);
  padding: 0.875rem 1rem 1rem;
}

.viz-card__header h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--dash-text);
}

.viz-card__header p {
  font-size: 0.75rem;
  color: var(--dash-muted);
  margin: 0.25rem 0 0.75rem;
}

.alert-stage {
  min-height: 8rem;
}

.alert-card {
  padding: 1rem 1.125rem;
  border-radius: var(--site-radius-sm);
  border-left: 4px solid var(--dash-muted);
  background: rgba(255, 255, 255, 0.03);
  animation: fadeIn 0.4s ease;
}

.alert-card--extreme {
  border-left-color: #a855f7;
}

.alert-card--severe {
  border-left-color: #ef4444;
}

.alert-card--moderate {
  border-left-color: #f97316;
}

.alert-card--minor {
  border-left-color: #eab308;
}

.alert-card__event {
  font-size: 1rem;
  font-weight: 600;
  color: var(--dash-text);
}

.alert-card__severity {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--dash-text-secondary);
  margin-top: 0.25rem;
}

.alert-card__area {
  font-size: 0.8125rem;
  color: var(--dash-muted);
  margin-top: 0.5rem;
}

.alert-card__headline {
  font-size: 0.875rem;
  color: var(--dash-text-secondary);
  margin-top: 0.5rem;
  line-height: 1.5;
}

.alert-dots {
  display: flex;
  gap: 0.375rem;
  justify-content: center;
  margin-top: 0.75rem;
}

.alert-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  padding: 0;
  background: var(--dash-border);
  cursor: pointer;
}

.alert-dot--active {
  background: var(--dash-accent);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
