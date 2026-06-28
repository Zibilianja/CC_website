<script setup lang="ts">
import { ref, watch } from 'vue';
import { useUserLocale } from '../../composables/useUserLocale';
import LocationPinMap from './LocationPinMap.vue';

withDefaults(
  defineProps<{
    compact?: boolean;
  }>(),
  { compact: false }
);

const {
  location,
  locationStatus,
  locationError,
  locationLabel,
  hasLocation,
  locationPickerOpen,
  requestLocation,
  setLocationFromSearch,
  setLocationFromMap,
  openLocationPicker,
} = useUserLocale();

const searchQuery = ref('');
const searchError = ref<string | null>(null);
const searchPending = ref(false);
const mapOpen = ref(false);

async function submitSearch() {
  searchError.value = null;
  searchPending.value = true;
  try {
    await setLocationFromSearch(searchQuery.value);
    searchQuery.value = '';
    mapOpen.value = false;
  } catch (err) {
    searchError.value = err instanceof Error ? err.message : 'Location lookup failed.';
  } finally {
    searchPending.value = false;
  }
}

function onPinConfirm(lat: number, lon: number) {
  setLocationFromMap(lat, lon);
  mapOpen.value = false;
}

function useBrowserLocation() {
  searchError.value = null;
  requestLocation();
}

watch(locationStatus, (status) => {
  if (status === 'granted') {
    locationPickerOpen.value = false;
  }
});
</script>

<template>
  <div class="location-selector" :class="{ 'location-selector--compact': compact }">
    <template v-if="hasLocation && !locationPickerOpen">
      <div class="location-selector__current">
        <span class="location-selector__label">Showing data for</span>
        <strong class="location-selector__value">{{ locationLabel }}</strong>
        <span v-if="location" class="location-selector__coords">
          {{ location.latitude.toFixed(2) }}°, {{ location.longitude.toFixed(2) }}°
        </span>
      </div>
      <button type="button" class="location-selector__btn" @click="openLocationPicker">
        Change location
      </button>
    </template>

    <template v-else>
      <form class="location-selector__search" @submit.prevent="submitSearch">
        <label class="location-selector__search-label" for="location-search-input">
          Or enter your ZIP code or city:
        </label>
        <div class="location-selector__search-row">
          <input
            id="location-search-input"
            v-model="searchQuery"
            type="text"
            class="location-selector__input"
            placeholder="80202 or Denver, CO"
            autocomplete="postal-code"
          />
          <button
            type="submit"
            class="location-selector__btn location-selector__btn--primary"
            :disabled="searchPending"
          >
            {{ searchPending ? 'Looking…' : 'Set' }}
          </button>
        </div>
      </form>

      <div class="location-selector__actions">
        <button type="button" class="location-selector__btn" @click="useBrowserLocation">
          Use my location
        </button>
        <button
          type="button"
          class="location-selector__btn"
          @click="mapOpen = !mapOpen"
        >
          {{ mapOpen ? 'Hide map' : 'Set on map' }}
        </button>
      </div>

      <p v-if="locationStatus === 'pending'" class="location-selector__hint">
        Requesting browser location…
      </p>
      <p v-if="searchError" class="location-selector__error">{{ searchError }}</p>
      <p v-else-if="locationError" class="location-selector__error">{{ locationError }}</p>

      <LocationPinMap
        v-if="mapOpen"
        @confirm="onPinConfirm"
        @cancel="mapOpen = false"
      />
    </template>
  </div>
</template>

<style scoped>
.location-selector {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 0.875rem 1rem;
  border: 1px solid var(--dash-border);
  border-radius: var(--site-radius);
  background: var(--dash-surface);
}

.location-selector--compact {
  padding: 0;
  border: none;
  background: transparent;
}

.location-selector__current {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.location-selector__label {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--dash-muted);
}

.location-selector__value {
  font-size: 0.9375rem;
  color: var(--dash-text);
}

.location-selector__coords {
  font-size: 0.6875rem;
  color: var(--dash-muted);
}

.location-selector__search-label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--dash-text);
  margin-bottom: 0.375rem;
}

.location-selector__search-row {
  display: flex;
  gap: 0.5rem;
}

.location-selector__input {
  flex: 1;
  min-width: 0;
  font-size: 0.8125rem;
  color: var(--dash-text);
  background: #1a1d26;
  border: 1px solid var(--dash-border);
  border-radius: var(--site-radius);
  padding: 0.4375rem 0.625rem;
}

.location-selector__input:focus {
  outline: 2px solid var(--dash-accent, #6366f1);
  outline-offset: 1px;
}

.location-selector__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.location-selector__btn {
  font-size: 0.8125rem;
  color: var(--dash-text);
  background: #1a1d26;
  border: 1px solid var(--dash-border);
  border-radius: var(--site-radius);
  padding: 0.375rem 0.75rem;
  cursor: pointer;
}

.location-selector__btn:hover:not(:disabled) {
  border-color: var(--dash-text-secondary);
}

.location-selector__btn--primary {
  border-color: var(--dash-accent, #6366f1);
  flex-shrink: 0;
}

.location-selector__btn:disabled {
  opacity: 0.55;
  cursor: wait;
}

.location-selector__hint,
.location-selector__error {
  font-size: 0.75rem;
  margin: 0;
}

.location-selector__hint {
  color: var(--dash-muted);
}

.location-selector__error {
  color: var(--dash-danger);
}
</style>
