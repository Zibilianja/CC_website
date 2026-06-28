<script setup lang="ts">
import { computed } from 'vue';
import type { NoaaScaleEntry } from '../../types/spaceWeather';

const props = defineProps<{
  scales: NoaaScaleEntry[];
}>();

interface ImpactCard {
  id: string;
  title: string;
  current: string;
  forecast: string;
  level: 'none' | 'minor' | 'moderate' | 'strong' | 'extreme';
  systems: string[];
}

function parseLevel(text: string): ImpactCard['level'] {
  const t = text.toLowerCase();
  if (t.includes('extreme') || t.includes('g5') || t.includes('r5') || t.includes('s5'))
    return 'extreme';
  if (t.includes('severe') || t.includes('g4') || t.includes('r4') || t.includes('s4'))
    return 'strong';
  if (t.includes('strong') || t.includes('g3') || t.includes('r3') || t.includes('s3'))
    return 'moderate';
  if (t.includes('minor') || t.includes('g1') || t.includes('r1') || t.includes('s1'))
    return 'minor';
  if (t === 'none' || t === '—' || !t) return 'none';
  return 'minor';
}

const cards = computed((): ImpactCard[] => {
  const today = props.scales[0];
  const tomorrow = props.scales[1];

  return [
    {
      id: 'radio',
      title: 'Radio blackouts',
      current: today?.radioBlackout ?? 'none',
      forecast: tomorrow?.radioBlackout ?? '—',
      level: parseLevel(today?.radioBlackout ?? 'none'),
      systems: ['HF radio', 'GPS signals', 'Aviation comms'],
    },
    {
      id: 'radiation',
      title: 'Radiation storms',
      current: today?.solarRadiation ?? 'none',
      forecast: tomorrow?.solarRadiation ?? '—',
      level: parseLevel(today?.solarRadiation ?? 'none'),
      systems: ['Satellites', 'High-altitude flights', 'Astronaut safety'],
    },
    {
      id: 'geomagnetic',
      title: 'Geomagnetic storms',
      current: today?.geomagnetic ?? 'none',
      forecast: tomorrow?.geomagnetic ?? '—',
      level: parseLevel(today?.geomagnetic ?? 'none'),
      systems: ['Power grids', 'Pipelines', 'Aurora visibility'],
    },
  ];
});

function levelClass(level: ImpactCard['level']) {
  return `impact-card--${level}`;
}
</script>

<template>
  <div class="impact-grid">
    <article
      v-for="card in cards"
      :key="card.id"
      class="impact-card"
      :class="levelClass(card.level)"
    >
      <h4 class="impact-card__title">{{ card.title }}</h4>
      <p class="impact-card__current">{{ card.current }}</p>
      <p class="impact-card__forecast">Forecast: {{ card.forecast }}</p>
      <ul class="impact-card__systems">
        <li v-for="sys in card.systems" :key="sys">{{ sys }}</li>
      </ul>
    </article>
  </div>
</template>

<style scoped>
.impact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: 0.75rem;
}

.impact-card {
  padding: 1rem;
  border-radius: var(--site-radius);
  border: 1px solid var(--dash-border);
  background: var(--dash-surface);
  border-top: 4px solid var(--dash-muted);
}

.impact-card--none {
  border-top-color: #22c55e;
}

.impact-card--minor {
  border-top-color: #eab308;
}

.impact-card--moderate {
  border-top-color: #f97316;
}

.impact-card--strong {
  border-top-color: #ef4444;
}

.impact-card--extreme {
  border-top-color: #a855f7;
}

.impact-card__title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--dash-text);
}

.impact-card__current {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--dash-text);
  margin-top: 0.375rem;
  text-transform: capitalize;
}

.impact-card__forecast {
  font-size: 0.75rem;
  color: var(--dash-muted);
  margin-top: 0.25rem;
}

.impact-card__systems {
  margin: 0.75rem 0 0;
  padding-left: 1rem;
  font-size: 0.75rem;
  color: var(--dash-text-secondary);
}

.impact-card__systems li + li {
  margin-top: 0.25rem;
}
</style>
