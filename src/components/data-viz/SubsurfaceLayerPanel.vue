<script setup lang="ts">
import { defineAsyncComponent, computed, ref } from 'vue';
import { useSpaceWeatherDashboard } from '../../stores/useSpaceWeatherDashboard';
import { useUserLocale } from '../../composables/useUserLocale';
import { narrateSubsurface } from '../../utils/layerNarratives';
import {
  EARTHQUAKE_TIMEFRAMES,
  timeframeShortLabel,
} from '../../constants/earthquakeTimeframes';
import type { EarthquakeTimeframe } from '../../types/spaceWeather';
import {
  MAGNITUDE_BANDS,
  NEARBY_EARTHQUAKE_RADIUS_KM,
  earthquakeDistanceKm,
  earthquakesNearLocation,
  filterByMagnitudeBands,
  sortEarthquakesByDistance,
  visibleEarthquakes,
  type MagnitudeBandId,
} from '../../utils/earthquake';
import LayerInsight from './LayerInsight.vue';
import LayerDetails from './LayerDetails.vue';
import DataTable from './DataTable.vue';
import LocationSelector from './LocationSelector.vue';

const EarthquakeGlobe = defineAsyncComponent(() => import('./EarthquakeGlobe.vue'));
const EarthquakeViewMap = defineAsyncComponent(() => import('./EarthquakeViewMap.vue'));
const MagnitudeTimeline = defineAsyncComponent(() => import('./MagnitudeTimeline.vue'));

const store = useSpaceWeatherDashboard();
const layer = computed(() => store.subsurface);
const timeframe = ref<EarthquakeTimeframe>('7d');
const {
  location: userLocation,
  locationStatus,
  locationLabel,
  unitSystem,
  formatDistance,
  nearbyRadiusLabel,
} = useUserLocale();

const magnitudeBandChecked = ref<Record<MagnitudeBandId, boolean>>({
  m25_4: true,
  m4_6: true,
  m6plus: true,
});

const activeMagnitudeBands = computed(() =>
  MAGNITUDE_BANDS.filter((band) => magnitudeBandChecked.value[band.id]).map(
    (band) => band.id
  )
);

const selectedEarthquakes = computed(() => {
  if (!layer.value.data) return [];
  return layer.value.data.earthquakesByTimeframe[timeframe.value] ?? [];
});

const filteredEarthquakes = computed(() =>
  filterByMagnitudeBands(selectedEarthquakes.value, activeMagnitudeBands.value)
);

const nearbyEarthquakes = computed(() => {
  if (!userLocation.value) return [];
  return sortEarthquakesByDistance(
    earthquakesNearLocation(
      filteredEarthquakes.value,
      userLocation.value.latitude,
      userLocation.value.longitude,
      NEARBY_EARTHQUAKE_RADIUS_KM
    ),
    userLocation.value.latitude,
    userLocation.value.longitude
  );
});

const nearbyLargest = computed(() => {
  if (!nearbyEarthquakes.value.length) return null;
  return nearbyEarthquakes.value.reduce((max, q) =>
    q.magnitude > max.magnitude ? q : max
  );
});

const narrative = computed(() => {
  if (!layer.value.data) return null;

  const closest =
    nearbyEarthquakes.value.length && userLocation.value
      ? nearbyEarthquakes.value[0]
      : null;

  return narrateSubsurface(layer.value.data, {
    locationKnown: userLocation.value != null,
    nearbyCount: nearbyEarthquakes.value.length,
    closestPlace: closest?.place,
    closestMagnitude: closest?.magnitude,
    closestDistanceKm:
      closest && userLocation.value
        ? earthquakeDistanceKm(
            closest,
            userLocation.value.latitude,
            userLocation.value.longitude
          )
        : undefined,
    radiusKm: NEARBY_EARTHQUAKE_RADIUS_KM,
    unitSystem: unitSystem.value,
  });
});

const timeframeLabel = computed(() => timeframeShortLabel(timeframe.value));

const tableEarthquakes = computed(() =>
  [...visibleEarthquakes(selectedEarthquakes.value)]
    .sort((a, b) => b.magnitude - a.magnitude)
    .slice(0, 50)
);
</script>

<template>
  <section class="layer-content">
    <div v-if="layer.status === 'loading' && !layer.data" class="skeleton" />

    <p v-else-if="layer.status === 'error'" class="layer-error">
      Could not load subsurface data. Try reloading the page.
    </p>

    <template v-else-if="layer.data && narrative">
      <LayerInsight :narrative="narrative" />

      <div class="location-panel">
        <div class="location-panel__header">
          <h4>Earthquakes near you</h4>
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
          <div class="location-panel__stats">
            <div class="location-stat">
              <span class="location-stat__value">{{ nearbyEarthquakes.length }}</span>
              <span class="location-stat__label">
                within {{ nearbyRadiusLabel }} · {{ timeframeLabel }}
              </span>
            </div>
            <div v-if="nearbyEarthquakes[0]" class="location-stat">
              <span class="location-stat__value">
                M{{ nearbyEarthquakes[0].magnitude.toFixed(1) }}
              </span>
              <span class="location-stat__label">
                closest ·
                {{
                  formatDistance(
                    earthquakeDistanceKm(
                      nearbyEarthquakes[0],
                      userLocation.latitude,
                      userLocation.longitude
                    )
                  )
                }}
              </span>
            </div>
            <div
              v-if="nearbyLargest && nearbyLargest.id !== nearbyEarthquakes[0]?.id"
              class="location-stat"
            >
              <span class="location-stat__value">
                M{{ nearbyLargest.magnitude.toFixed(1) }}
              </span>
              <span class="location-stat__label">largest nearby</span>
            </div>
          </div>
          <p v-if="!nearbyEarthquakes.length" class="location-panel__empty">
            No M2.5+ events in your area for this time frame and filter selection.
          </p>
        </template>

        <template v-else>
          <LocationSelector compact />
        </template>
      </div>

      <div class="timeframe-bar">
        <label class="timeframe-bar__label" for="earthquake-timeframe">
          Time frame
        </label>
        <select
          id="earthquake-timeframe"
          v-model="timeframe"
          class="timeframe-bar__select"
        >
          <option
            v-for="option in EARTHQUAKE_TIMEFRAMES"
            :key="option.id"
            :value="option.id"
          >
            {{ option.label }}
          </option>
        </select>
        <span class="timeframe-bar__count">
          {{ filteredEarthquakes.length.toLocaleString() }}
          events (M2.5+)
        </span>
      </div>

      <div class="magnitude-filters" role="group" aria-label="Magnitude bands">
        <span class="magnitude-filters__label">Show magnitude</span>
        <label
          v-for="band in MAGNITUDE_BANDS"
          :key="band.id"
          class="magnitude-filters__option"
        >
          <input
            v-model="magnitudeBandChecked[band.id]"
            type="checkbox"
            class="magnitude-filters__input"
          />
          <span
            class="magnitude-filters__swatch"
            :style="{ background: band.color, boxShadow: `0 0 6px ${band.color}` }"
            aria-hidden="true"
          />
          {{ band.label }}
        </label>
        <span v-if="activeMagnitudeBands.length === 0" class="magnitude-filters__hint">
          (none selected — showing all)
        </span>
      </div>

      <div class="quake-layout">
        <div class="quake-layout__row">
          <EarthquakeGlobe
            :earthquakes="filteredEarthquakes"
            :timeframe-label="timeframeLabel"
            :user-location="userLocation"
          />
          <MagnitudeTimeline
            :earthquakes="filteredEarthquakes"
            :timeframe-label="timeframeLabel"
          />
        </div>

        <EarthquakeViewMap
          :earthquakes="filteredEarthquakes"
          :timeframe-label="timeframeLabel"
          :user-location="userLocation"
        />
      </div>

      <LayerDetails label="View earthquake table">
        <div class="tables-grid">
          <DataTable :title="`Earthquakes — ${timeframeLabel} (M2.5+, top 50)`">
            <table v-if="tableEarthquakes.length">
              <thead>
                <tr>
                  <th>Mag</th>
                  <th>Location</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="quake in tableEarthquakes" :key="quake.id">
                  <td class="severity--high">{{ quake.magnitude.toFixed(1) }}</td>
                  <td>{{ quake.place }}</td>
                  <td>{{ new Date(quake.time).toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
            <p v-else class="empty">No M2.5+ events in this period.</p>
          </DataTable>

          <DataTable title="Significant earthquakes (24h)">
            <table v-if="layer.data.earthquakes.length">
              <thead>
                <tr>
                  <th>Mag</th>
                  <th>Location</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="quake in layer.data.earthquakes" :key="quake.id">
                  <td class="severity--high">{{ quake.magnitude.toFixed(1) }}</td>
                  <td>{{ quake.place }}</td>
                  <td>{{ new Date(quake.time).toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
            <p v-else class="empty">None reported in the last 24 hours.</p>
          </DataTable>
        </div>
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
  margin: 0.375rem 0 0.75rem;
}

.location-panel__muted {
  color: var(--dash-muted);
}

.location-panel__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
}

.location-stat {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.location-stat__value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--dash-text);
}

.location-stat__label {
  font-size: 0.6875rem;
  color: var(--dash-muted);
}

.location-panel__empty {
  font-size: 0.8125rem;
  color: var(--dash-muted);
  margin: 0.25rem 0 0;
}

.timeframe-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--dash-border);
  border-radius: var(--site-radius);
  background: var(--dash-surface);
}

.timeframe-bar__label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--dash-text);
}

.timeframe-bar__select {
  font-size: 0.8125rem;
  color: var(--dash-text);
  background: #1a1d26;
  border: 1px solid var(--dash-border);
  border-radius: var(--site-radius);
  padding: 0.375rem 0.625rem;
  cursor: pointer;
}

.timeframe-bar__select:focus {
  outline: 2px solid var(--dash-accent, #6366f1);
  outline-offset: 1px;
}

.timeframe-bar__count {
  font-size: 0.75rem;
  color: var(--dash-muted);
  margin-left: auto;
}

.magnitude-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  padding: 0.625rem 1rem;
  border: 1px solid var(--dash-border);
  border-radius: var(--site-radius);
  background: var(--dash-surface);
}

.magnitude-filters__label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--dash-text);
}

.magnitude-filters__option {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--dash-muted);
  cursor: pointer;
  user-select: none;
}

.magnitude-filters__input {
  width: 0.875rem;
  height: 0.875rem;
  margin: 0;
  accent-color: var(--dash-accent, #6366f1);
  cursor: pointer;
}

.magnitude-filters__swatch {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.magnitude-filters__hint {
  font-size: 0.6875rem;
  color: var(--dash-muted);
  font-style: italic;
}

.quake-layout {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.quake-layout__row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 0.75rem;
}

.tables-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 0.75rem;
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

.empty {
  color: var(--dash-muted);
  font-size: 0.875rem;
  margin-top: 1rem;
}
</style>
