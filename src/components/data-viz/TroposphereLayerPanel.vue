<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { useSpaceWeatherDashboard } from '../../stores/useSpaceWeatherDashboard';
import { useUserLocale } from '../../composables/useUserLocale';
import { useLocalWeather } from '../../composables/useLocalWeather';
import { narrateTroposphere } from '../../utils/layerNarratives';
import LayerInsight from './LayerInsight.vue';
import LayerDetails from './LayerDetails.vue';
import LocalWeatherSection from './LocalWeatherSection.vue';

const UsAlertsPanel = defineAsyncComponent(() => import('./UsAlertsPanel.vue'));

const store = useSpaceWeatherDashboard();
const layer = computed(() => store.troposphere);
const { unitSystem } = useUserLocale();
const { weather: localWeather, alerts: localAlerts } = useLocalWeather();

const narrative = computed(() => {
  if (!layer.value.data) return null;
  const data = localWeather.value
    ? { ...layer.value.data, openWeather: localWeather.value }
    : layer.value.data;
  return narrateTroposphere(data, unitSystem.value, {
    localAlertCount: localWeather.value ? localAlerts.value.length : undefined,
  });
});
</script>

<template>
  <section class="layer-content">
    <div v-if="layer.status === 'loading' && !layer.data" class="skeleton" />

    <p v-else-if="layer.status === 'error'" class="layer-error">
      Could not load weather data. Try reloading the page.
    </p>

    <template v-else-if="layer.data && narrative">
      <LayerInsight :narrative="narrative" />

      <LocalWeatherSection />

      <UsAlertsPanel :alerts="layer.data.alerts" />

      <LayerDetails label="View alert summary">
        <p class="details-note">
          {{ layer.data.alerts.length }} US severe weather alerts in this snapshot.
          Global weather events and wildfires are in the Surface layer below.
        </p>
      </LayerDetails>
    </template>
  </section>
</template>

<style scoped>
.layer-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.details-note {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: var(--dash-muted);
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
