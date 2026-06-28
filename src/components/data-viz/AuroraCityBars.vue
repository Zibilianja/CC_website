<script setup lang="ts">
import { computed } from 'vue';
import type { AuroraPoint } from '../../types/spaceWeather';
import { AURORA_CITIES } from '../../constants/auroraCities';
import { viewingPercentAt } from '../../utils/auroraViewing';

const props = defineProps<{
  points: AuroraPoint[];
  maxIntensity: number;
}>();

const cities = computed(() =>
  AURORA_CITIES.map((city) => {
    const probability = viewingPercentAt(
      props.points,
      city.lat,
      city.lon,
      props.maxIntensity
    );
    const localTime = new Date().toLocaleTimeString('en-US', {
      timeZone: city.timezone,
      hour: 'numeric',
      minute: '2-digit',
    });
    const isDark = isNightHour(city.timezone);
    return { ...city, probability, localTime, isDark };
  }).sort((a, b) => b.probability - a.probability)
);

function isNightHour(timezone: string): boolean {
  const hour = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false,
    }).format(new Date())
  );
  return hour >= 18 || hour < 6;
}

function barColor(pct: number): string {
  if (pct >= 60) return '#22c55e';
  if (pct >= 30) return '#86efac';
  if (pct >= 10) return '#9ca3af';
  return '#4b5563';
}
</script>

<template>
  <div class="viz-card">
    <div class="viz-card__header">
      <h4>Viewing probability by city</h4>
      <p>Estimated ground viewing chance (overhead + poleward horizon)</p>
    </div>
    <ul class="city-list">
      <li v-for="city in cities" :key="city.name" class="city-row">
        <div class="city-row__meta">
          <span class="city-row__name">{{ city.name }}</span>
          <span class="city-row__time">{{ city.localTime }} local</span>
        </div>
        <div class="city-row__bar-wrap">
          <div
            class="city-row__bar"
            :style="{
              width: `${city.probability}%`,
              background: barColor(city.probability),
            }"
          />
        </div>
        <span class="city-row__pct">{{ city.probability }}%</span>
        <span v-if="city.isDark && city.probability >= 20" class="city-row__tip">
          Good viewing window
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.viz-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--dash-border);
  border-radius: var(--site-radius);
  background: var(--dash-surface);
  overflow: hidden;
  min-width: 0;
  min-height: 0;
  height: 100%;
}

.viz-card__header {
  flex-shrink: 0;
  padding: 0.875rem 1rem 0;
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

.city-list {
  list-style: none;
  margin: 0;
  padding: 0 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.city-row {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto auto;
  gap: 0.25rem 0.75rem;
  align-items: center;
}

.city-row__meta {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.city-row__name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--dash-text);
}

.city-row__time {
  font-size: 0.75rem;
  color: var(--dash-muted);
}

.city-row__bar-wrap {
  grid-column: 1 / -1;
  height: 8px;
  background: var(--dash-border);
  border-radius: 999px;
  overflow: hidden;
}

.city-row__bar {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease;
}

.city-row__pct {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--dash-text-secondary);
}

.city-row__tip {
  grid-column: 1 / -1;
  font-size: 0.6875rem;
  color: var(--dash-success);
  font-weight: 600;
}
</style>
