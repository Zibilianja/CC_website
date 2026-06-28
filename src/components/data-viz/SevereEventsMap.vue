<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { NaturalEvent, WeatherEventType } from '../../types/spaceWeather';
import {
  defaultWeatherTypeChecked,
  WEATHER_EVENT_DAYS,
  WEATHER_EVENT_FILTERS,
  weatherEventColor,
} from '../../utils/weatherEvents';

const props = defineProps<{
  events: NaturalEvent[];
}>();

const mapRef = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let layer: L.LayerGroup | null = null;

const typeChecked = reactive(defaultWeatherTypeChecked());

const activeTypes = computed(() =>
  WEATHER_EVENT_FILTERS.filter((f) => typeChecked[f.id]).map((f) => f.id)
);

const filteredEvents = computed(() => {
  if (activeTypes.value.length === 0) return props.events;
  return props.events.filter((e) => typeChecked[e.eventType]);
});

const locatedCount = computed(() =>
  filteredEvents.value.filter((e) => e.latitude != null && e.longitude != null).length
);

const MIN_ZOOM = 2;
const DEFAULT_CENTER: [number, number] = [20, 0];
const DEFAULT_ZOOM = 2;

function clampZoomFloor() {
  if (!map) return;
  if (map.getZoom() < MIN_ZOOM) {
    map.setZoom(MIN_ZOOM);
  }
}

function filterLabel(type: WeatherEventType): string {
  return WEATHER_EVENT_FILTERS.find((f) => f.id === type)?.label ?? type;
}

function initMap() {
  if (!mapRef.value || map) return;

  map = L.map(mapRef.value, {
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    minZoom: MIN_ZOOM,
    maxZoom: 8,
    scrollWheelZoom: false,
    worldCopyJump: true,
    maxBounds: [
      [-85, -180],
      [85, 180],
    ],
    maxBoundsViscosity: 0.85,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  layer = L.layerGroup().addTo(map);
  updateMarkers();

  setTimeout(() => map?.invalidateSize(), 100);
}

function updateMarkers() {
  if (!map || !layer) return;
  layer.clearLayers();

  const located = filteredEvents.value.filter(
    (e) => e.latitude != null && e.longitude != null
  );

  for (const event of located) {
    const color = weatherEventColor(event.eventType);
    const marker = L.circleMarker([event.latitude!, event.longitude!], {
      radius: 7,
      color,
      fillColor: color,
      fillOpacity: 0.78,
      weight: 2,
    });
    marker.bindPopup(
      `<strong>${event.title}</strong><br>${filterLabel(event.eventType)}<br><small>${event.date}</small>`
    );
    layer.addLayer(marker);
  }

  if (located.length === 1) {
    map.setView(
      [located[0].latitude!, located[0].longitude!],
      Math.max(4, MIN_ZOOM)
    );
    return;
  }

  if (located.length > 1) {
    const bounds = L.latLngBounds(
      located.map((e) => [e.latitude!, e.longitude!] as [number, number])
    );
    const lngSpan = bounds.getEast() - bounds.getWest();

    if (lngSpan > 120) {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      return;
    }

    map.fitBounds(bounds.pad(0.3), { maxZoom: 6 });
    clampZoomFloor();
    return;
  }

  map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
}

onMounted(initMap);

onUnmounted(() => {
  map?.remove();
  map = null;
});

watch(filteredEvents, updateMarkers, { deep: true });
</script>

<template>
  <div class="viz-card">
    <div class="viz-card__header">
      <h4>Global weather events — last {{ WEATHER_EVENT_DAYS }} days</h4>
      <p>
        NASA EONET — wildfires, hurricanes, tornadoes, hail, floods, and other
        damaging weather. {{ locatedCount }} of {{ filteredEvents.length }} shown on map
        (events need a reported position to appear as dots).
      </p>
    </div>

    <div class="type-filters" role="group" aria-label="Weather event types">
      <span class="type-filters__label">Show type</span>
      <label
        v-for="filter in WEATHER_EVENT_FILTERS"
        :key="filter.id"
        class="type-filters__option"
      >
        <input
          v-model="typeChecked[filter.id]"
          type="checkbox"
          class="type-filters__input"
        />
        <span
          class="type-filters__swatch"
          :style="{ background: filter.color, boxShadow: `0 0 6px ${filter.color}` }"
          aria-hidden="true"
        />
        {{ filter.label }}
      </label>
      <span v-if="activeTypes.length === 0" class="type-filters__hint">
        (none selected — enable a type above)
      </span>
    </div>

    <div ref="mapRef" class="map-canvas" />
  </div>
</template>

<style scoped>
.viz-card {
  border: 1px solid var(--dash-border);
  border-radius: var(--site-radius);
  background: var(--dash-surface);
  overflow: hidden;
}

.viz-card__header {
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
  margin-top: 0.25rem;
  line-height: 1.45;
}

.type-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem 0.75rem;
  padding: 0.625rem 1rem 0;
}

.type-filters__label {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--dash-muted);
  margin-right: 0.25rem;
}

.type-filters__option {
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  font-size: 0.75rem;
  color: var(--dash-text-secondary);
  cursor: pointer;
  user-select: none;
}

.type-filters__input {
  accent-color: var(--dash-accent);
}

.type-filters__swatch {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.type-filters__hint {
  font-size: 0.6875rem;
  color: var(--dash-muted);
  font-style: italic;
}

.map-canvas {
  width: 100%;
  height: 300px;
  margin-top: 0.5rem;
}

:deep(.leaflet-container) {
  background: #0f1117;
  font-family: var(--site-font);
}
</style>
