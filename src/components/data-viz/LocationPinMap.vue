<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const emit = defineEmits<{
  confirm: [latitude: number, longitude: number];
  cancel: [];
}>();

const mapRef = ref<HTMLElement | null>(null);
const pin = ref<{ lat: number; lon: number } | null>(null);
let map: L.Map | null = null;
let marker: L.CircleMarker | null = null;

function setPin(lat: number, lon: number) {
  pin.value = { lat, lon };
  if (!map) return;

  if (marker) {
    marker.setLatLng([lat, lon]);
  } else {
    marker = L.circleMarker([lat, lon], {
      radius: 8,
      color: '#c4b5fd',
      fillColor: '#c4b5fd',
      fillOpacity: 0.9,
      weight: 2,
    }).addTo(map);
  }
}

function initMap() {
  if (!mapRef.value || map) return;

  map = L.map(mapRef.value, {
    center: [39.5, -98.35],
    zoom: 4,
    minZoom: 2,
    scrollWheelZoom: true,
    worldCopyJump: true,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  map.on('click', (event) => {
    setPin(event.latlng.lat, event.latlng.lng);
  });

  setTimeout(() => map?.invalidateSize(), 100);
}

function confirm() {
  if (!pin.value) return;
  emit('confirm', pin.value.lat, pin.value.lon);
}

onMounted(initMap);

onUnmounted(() => {
  map?.remove();
  map = null;
});
</script>

<template>
  <div class="pin-map-panel" role="dialog" aria-label="Set location on map">
    <div class="pin-map-panel__header">
      <h5>Set on map</h5>
      <p>Click the map to drop a pin, then confirm.</p>
    </div>
    <div ref="mapRef" class="pin-map-panel__canvas" />
    <div class="pin-map-panel__actions">
      <button type="button" class="pin-map-panel__btn" @click="emit('cancel')">
        Cancel
      </button>
      <button
        type="button"
        class="pin-map-panel__btn pin-map-panel__btn--primary"
        :disabled="!pin"
        @click="confirm"
      >
        Use this location
      </button>
    </div>
  </div>
</template>

<style scoped>
.pin-map-panel {
  border: 1px solid var(--dash-border);
  border-radius: var(--site-radius);
  background: #14171f;
  padding: 0.75rem;
}

.pin-map-panel__header h5 {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--dash-text);
}

.pin-map-panel__header p {
  margin: 0.25rem 0 0.625rem;
  font-size: 0.75rem;
  color: var(--dash-muted);
}

.pin-map-panel__canvas {
  width: 100%;
  height: 260px;
  border-radius: var(--site-radius-sm);
  overflow: hidden;
}

.pin-map-panel__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.625rem;
}

.pin-map-panel__btn {
  font-size: 0.8125rem;
  color: var(--dash-text);
  background: #1a1d26;
  border: 1px solid var(--dash-border);
  border-radius: var(--site-radius);
  padding: 0.375rem 0.75rem;
  cursor: pointer;
}

.pin-map-panel__btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.pin-map-panel__btn--primary {
  border-color: var(--dash-accent, #6366f1);
}

:deep(.leaflet-container) {
  background: #0f1117;
  font-family: var(--site-font);
}
</style>
