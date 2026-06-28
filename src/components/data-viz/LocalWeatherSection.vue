<script setup lang="ts">
import { useLocalWeather } from '../../composables/useLocalWeather';
import LocationSelector from './LocationSelector.vue';
import MetricStat from './MetricStat.vue';

const {
  weather,
  alerts,
  status,
  error,
  location,
  hasLocation,
  alertsAvailable,
  formatTemperature,
  windDisplay,
  airQualityDisplay,
  uvDisplay,
  precipDisplay,
} = useLocalWeather();

function severityClass(severity: string) {
  const s = severity.toLowerCase();
  if (s === 'extreme') return 'local-alert--extreme';
  if (s === 'severe') return 'local-alert--severe';
  if (s === 'moderate') return 'local-alert--moderate';
  return 'local-alert--minor';
}
</script>

<template>
  <section class="local-weather" aria-labelledby="local-weather-heading">
    <div class="local-weather__header">
      <h4 id="local-weather-heading">Your area</h4>
      <span v-if="location" class="local-weather__coords">
        {{ location.latitude.toFixed(2) }}°, {{ location.longitude.toFixed(2) }}°
      </span>
    </div>

    <LocationSelector compact />

    <div v-if="hasLocation && status === 'loading'" class="local-weather__loading">
      Loading conditions for your area…
    </div>

    <template v-else-if="hasLocation && weather">
      <p class="local-weather__place">{{ weather.description }}</p>

      <div class="local-weather__metrics">
        <MetricStat
          label="Local weather"
          :value="weather.location"
          :hint="weather.description"
        />
        <MetricStat
          label="Temperature"
          :value="formatTemperature(weather.tempC)"
        />
        <MetricStat
          label="Wind"
          :value="windDisplay"
          hint="Speed and direction"
        />
        <MetricStat
          label="Humidity"
          :value="`${weather.humidity}%`"
          hint="Relative humidity"
        />
        <MetricStat
          label="Air quality"
          :value="airQualityDisplay"
          hint="OpenWeather AQI scale (1 = good)"
        />
        <MetricStat
          label="UV index"
          :value="uvDisplay"
          hint="Current UV exposure level"
        />
        <MetricStat
          label="Precip chance"
          :value="precipDisplay"
          hint="Next 3-hour forecast period"
        />
      </div>

      <div class="local-weather__alerts">
        <div class="local-weather__alerts-header">
          <h5>Alerts for your area</h5>
          <span v-if="alertsAvailable" class="local-weather__alerts-count">
            {{ alerts.length }} active
          </span>
        </div>

        <p v-if="!alertsAvailable" class="local-weather__alerts-note">
          NOAA severe weather alerts are available for US locations.
        </p>

        <ul v-else-if="alerts.length" class="local-alert-list">
          <li
            v-for="alert in alerts"
            :key="alert.id"
            class="local-alert"
            :class="severityClass(alert.severity)"
          >
            <p class="local-alert__event">{{ alert.event }}</p>
            <p class="local-alert__meta">
              {{ alert.severity }} · {{ alert.region }}
            </p>
            <p class="local-alert__area">
              <span class="local-alert__area-label">Areas:</span> {{ alert.area }}
            </p>
            <p class="local-alert__headline">{{ alert.headline }}</p>
          </li>
        </ul>

        <p v-else class="local-weather__alerts-empty">
          No active weather alerts for your area right now.
        </p>
      </div>
    </template>

    <p v-else-if="hasLocation && error" class="local-weather__error">{{ error }}</p>
  </section>
</template>

<style scoped>
.local-weather {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--dash-border);
  border-radius: var(--site-radius);
  background: var(--dash-surface);
}

.local-weather__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.local-weather__header h4 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--dash-text);
  margin: 0;
}

.local-weather__place {
  font-size: 0.8125rem;
  color: var(--dash-muted);
  margin: 0;
}

.local-weather__coords {
  font-size: 0.6875rem;
  color: var(--dash-muted);
  white-space: nowrap;
}

.local-weather__loading,
.local-weather__error,
.local-weather__alerts-empty,
.local-weather__alerts-note {
  font-size: 0.8125rem;
  color: var(--dash-muted);
  margin: 0;
}

.local-weather__error {
  color: var(--dash-danger);
}

.local-weather__metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
  gap: 0.75rem;
}

.local-weather__alerts {
  padding-top: 0.25rem;
  border-top: 1px solid var(--dash-border);
}

.local-weather__alerts-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.625rem;
}

.local-weather__alerts-header h5 {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--dash-text);
  margin: 0;
}

.local-weather__alerts-count {
  font-size: 0.6875rem;
  color: var(--dash-muted);
}

.local-alert-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 14rem;
  overflow-y: auto;
}

.local-alert {
  padding: 0.75rem 0.875rem;
  border-radius: var(--site-radius-sm);
  border-left: 3px solid var(--dash-muted);
  background: rgba(255, 255, 255, 0.03);
}

.local-alert--extreme {
  border-left-color: #a855f7;
}

.local-alert--severe {
  border-left-color: #ef4444;
}

.local-alert--moderate {
  border-left-color: #f97316;
}

.local-alert--minor {
  border-left-color: #eab308;
}

.local-alert__event {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--dash-text);
  margin: 0;
}

.local-alert__meta {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--dash-text-secondary);
  margin: 0.25rem 0 0;
}

.local-alert__area {
  font-size: 0.75rem;
  color: var(--dash-muted);
  margin: 0.375rem 0 0;
  line-height: 1.45;
}

.local-alert__area-label {
  font-weight: 600;
  color: var(--dash-text-secondary);
}

.local-alert__headline {
  font-size: 0.8125rem;
  color: var(--dash-muted);
  margin: 0.375rem 0 0;
  line-height: 1.45;
}
</style>
