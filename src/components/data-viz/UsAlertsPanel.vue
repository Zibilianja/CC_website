<script setup lang="ts">
import { computed } from 'vue';
import type { WeatherAlert } from '../../types/spaceWeather';
import { useAlertCarousel } from '../../composables/useAlertCarousel';
import AlertAreaMap from './AlertAreaMap.vue';

const props = defineProps<{
  alerts: WeatherAlert[];
}>();

const alertCount = computed(() => props.alerts.length);
const { activeIndex, paused, select, prev, next, play } = useAlertCarousel(alertCount, 7000);

const active = computed(() => props.alerts[activeIndex.value] ?? null);

function severityClass(severity: string) {
  const s = severity.toLowerCase();
  if (s === 'extreme') return 'alert-card--extreme';
  if (s === 'severe') return 'alert-card--severe';
  if (s === 'moderate') return 'alert-card--moderate';
  return 'alert-card--minor';
}
</script>

<template>
  <div class="us-alerts-panel">
    <div class="us-alerts-panel__header">
      <div>
        <h4>US severe weather alerts</h4>
        <p v-if="alerts.length">
          {{ alerts.length }} active nationwide
          <span v-if="alerts.length > 1 && !paused"> · cycling every 7s</span>
          <span v-else-if="alerts.length > 1 && paused"> · paused</span>
        </p>
        <p v-else>No active US alerts in this snapshot</p>
      </div>

      <div v-if="alerts.length > 1" class="us-alerts-panel__controls">
        <button
          type="button"
          class="shuttle-btn"
          aria-label="Previous alert"
          @click="prev"
        >
          ‹
        </button>
        <span class="us-alerts-panel__counter">
          {{ activeIndex + 1 }} / {{ alerts.length }}
        </span>
        <button
          type="button"
          class="shuttle-btn"
          aria-label="Next alert"
          @click="next"
        >
          ›
        </button>
        <button
          v-if="paused"
          type="button"
          class="shuttle-btn shuttle-btn--play"
          aria-label="Resume auto-cycle"
          title="Resume auto-cycle"
          @click="play"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="active" class="us-alerts-panel__body">
      <article class="alert-card" :class="severityClass(active.severity)">
        <p class="alert-card__event">{{ active.event }}</p>
        <p class="alert-card__severity">
          {{ active.severity }} · {{ active.region }}
        </p>
        <p class="alert-card__area">
          <span class="alert-card__area-label">Areas:</span> {{ active.area }}
        </p>
        <p class="alert-card__headline">{{ active.headline }}</p>
      </article>

      <AlertAreaMap :alert="active" />
    </div>

    <div v-if="alerts.length > 1" class="alert-dots">
      <button
        v-for="(alert, i) in alerts"
        :key="alert.id"
        type="button"
        class="alert-dot"
        :class="{ 'alert-dot--active': i === activeIndex }"
        :aria-label="`Alert ${i + 1}: ${alert.event}`"
        @click="select(i)"
      />
    </div>
  </div>
</template>

<style scoped>
.us-alerts-panel {
  border: 1px solid var(--dash-border);
  border-radius: var(--site-radius);
  background: var(--dash-surface);
  padding: 0.875rem 1rem 1rem;
}

.us-alerts-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.us-alerts-panel__header h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--dash-text);
  margin: 0;
}

.us-alerts-panel__header p {
  font-size: 0.75rem;
  color: var(--dash-muted);
  margin: 0.25rem 0 0;
}

.us-alerts-panel__controls {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-shrink: 0;
}

.us-alerts-panel__counter {
  font-size: 0.6875rem;
  color: var(--dash-muted);
  min-width: 3rem;
  text-align: center;
}

.shuttle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  border: 1px solid var(--dash-border);
  border-radius: var(--site-radius);
  background: #1a1d26;
  color: var(--dash-text);
  font-size: 1.125rem;
  line-height: 1;
  cursor: pointer;
}

.shuttle-btn:hover {
  border-color: var(--dash-text-secondary);
}

.shuttle-btn--play svg {
  width: 0.75rem;
  height: 0.75rem;
}

.us-alerts-panel__body {
  display: grid;
  grid-template-columns: minmax(14rem, 1fr) minmax(16rem, 1.1fr);
  gap: 0.75rem;
  align-items: start;
}

.alert-card {
  padding: 1rem 1.125rem;
  border-radius: var(--site-radius-sm);
  border-left: 4px solid var(--dash-muted);
  background: rgba(255, 255, 255, 0.03);
  animation: fadeIn 0.35s ease;
  min-height: 8rem;
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
  margin: 0;
}

.alert-card__severity {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--dash-text-secondary);
  margin: 0.25rem 0 0;
}

.alert-card__area {
  font-size: 0.8125rem;
  color: var(--dash-muted);
  margin: 0.5rem 0 0;
  line-height: 1.45;
}

.alert-card__area-label {
  font-weight: 600;
  color: var(--dash-text-secondary);
}

.alert-card__headline {
  font-size: 0.875rem;
  color: var(--dash-text-secondary);
  margin: 0.5rem 0 0;
  line-height: 1.5;
}

.alert-dots {
  display: flex;
  gap: 0.375rem;
  justify-content: center;
  flex-wrap: wrap;
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

@media (max-width: 52rem) {
  .us-alerts-panel__body {
    grid-template-columns: 1fr;
  }
}
</style>
