<script setup lang="ts">
import { defineAsyncComponent, computed } from 'vue';
import { useSpaceWeatherDashboard } from '../../stores/useSpaceWeatherDashboard';
import { useUserLocale } from '../../composables/useUserLocale';
import { narrateSurface } from '../../utils/layerNarratives';
import LayerInsight from './LayerInsight.vue';
import LocationSelector from './LocationSelector.vue';
import ImpactDashboard from './ImpactDashboard.vue';

const SevereEventsMap = defineAsyncComponent(() => import('./SevereEventsMap.vue'));
const WildfireMap = defineAsyncComponent(() => import('./WildfireMap.vue'));

const store = useSpaceWeatherDashboard();
const layer = computed(() => store.ground);
const { location: userLocation, locationLabel, locationStatus } = useUserLocale();

const narrative = computed(() => {
  if (!layer.value.data) return null;
  return narrateSurface(layer.value.data);
});
</script>

<template>
  <section class="layer-content">
    <div v-if="layer.status === 'loading' && !layer.data" class="skeleton" />

    <p v-else-if="layer.status === 'error'" class="layer-error">
      Could not load surface data. Try reloading the page.
    </p>

    <template v-else-if="layer.data && narrative">
      <LayerInsight :narrative="narrative" />

      <ImpactDashboard :scales="layer.data.impactScales" />

      <div class="location-panel">
        <div class="location-panel__header">
          <h4>Near you</h4>
          <span v-if="locationStatus === 'pending'" class="location-panel__status">
            Locating…
          </span>
        </div>

        <template v-if="userLocation">
          <p class="location-panel__coords">
            {{ locationLabel }}
            <span class="location-panel__muted">
              ({{ userLocation.latitude.toFixed(2) }}°, {{ userLocation.longitude.toFixed(2) }}°)
            </span>
          </p>
          <p class="location-panel__hint">
            Location is shared across the dashboard — see Troposphere for local weather and
            Subsurface for nearby earthquakes.
          </p>
        </template>

        <template v-else>
          <LocationSelector compact />
        </template>
      </div>

      <SevereEventsMap :events="layer.data.weatherEvents" />

      <WildfireMap
        :fires="layer.data.wildfires"
        :region-count="layer.data.wildfireRegionCount"
        :capped-regions="layer.data.wildfireCappedRegions"
      />
    </template>
  </section>
</template>

<style scoped>
.layer-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.location-panel {
  padding: 0.875rem 1rem;
  border: 1px solid var(--dash-border);
  border-radius: var(--site-radius);
  background: var(--dash-surface);
}

.location-panel__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.location-panel__header h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--dash-text);
  margin: 0;
}

.location-panel__status {
  font-size: 0.6875rem;
  color: var(--dash-muted);
}

.location-panel__coords {
  font-size: 0.75rem;
  color: var(--dash-text-secondary);
  margin: 0.375rem 0 0;
}

.location-panel__muted {
  color: var(--dash-muted);
}

.location-panel__hint {
  font-size: 0.75rem;
  color: var(--dash-muted);
  margin: 0.5rem 0 0;
  line-height: 1.45;
}

.skeleton {
  height: 6rem;
  border-radius: var(--site-radius);
  background: var(--dash-border);
  opacity: 0.4;
}

.layer-error {
  color: var(--dash-danger);
  font-size: 0.9375rem;
}
</style>
