<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { EarthquakeFeature } from '../../types/spaceWeather';
import type { UserLocation } from '../../composables/useUserLocation';
import {
  magnitudeColor,
  magnitudeToFeltRadiusKm,
  visibleEarthquakes,
} from '../../utils/earthquake';

const props = defineProps<{
  earthquakes: EarthquakeFeature[];
  timeframeLabel: string;
  userLocation?: UserLocation | null;
}>();

const mapRef = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let quakeLayer: L.LayerGroup | null = null;
let userLayer: L.LayerGroup | null = null;
let hasCenteredOnUser = false;

function popupHtml(quake: EarthquakeFeature): string {
  return `<strong>M${quake.magnitude.toFixed(1)}</strong><br>${quake.place}<br>${new Date(quake.time).toLocaleString()}`;
}

function updateUserMarker() {
  if (!map || !userLayer) return;

  userLayer.clearLayers();
  const loc = props.userLocation;
  if (!loc) return;

  L.circleMarker([loc.latitude, loc.longitude], {
    radius: 6,
    color: '#c4b5fd',
    fillColor: '#c4b5fd',
    fillOpacity: 0.9,
    weight: 2,
  })
    .bindTooltip('Your location', { direction: 'top', className: 'quake-map-tooltip' })
    .addTo(userLayer);

  if (!hasCenteredOnUser) {
    map.setView([loc.latitude, loc.longitude], 4);
    hasCenteredOnUser = true;
  }
}

function updateMarkers() {
  if (!map || !quakeLayer) return;

  quakeLayer.clearLayers();
  const events = visibleEarthquakes(props.earthquakes);

  for (const quake of events) {
    const color = magnitudeColor(quake.magnitude);
    const feltM = magnitudeToFeltRadiusKm(quake.magnitude) * 1000;

    L.circle([quake.latitude, quake.longitude], {
      radius: feltM,
      color,
      fillColor: color,
      fillOpacity: 0.1,
      weight: 1,
      opacity: 0.35,
      interactive: false,
    }).addTo(quakeLayer);

    L.circleMarker([quake.latitude, quake.longitude], {
      radius: 3,
      color,
      fillColor: color,
      fillOpacity: 0.95,
      weight: 1,
    })
      .bindTooltip(
        `M${quake.magnitude.toFixed(1)} — ${quake.place}`,
        { direction: 'top', className: 'quake-map-tooltip' }
      )
      .bindPopup(popupHtml(quake), { className: 'quake-map-popup' })
      .addTo(quakeLayer);
  }
}

function initMap() {
  if (!mapRef.value || map) return;

  const loc = props.userLocation;
  const center: [number, number] = loc
    ? [loc.latitude, loc.longitude]
    : [20, 0];
  const zoom = loc ? 4 : 2;

  map = L.map(mapRef.value, {
    center,
    zoom,
    minZoom: 2,
    maxZoom: 8,
    scrollWheelZoom: false,
    worldCopyJump: true,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  quakeLayer = L.layerGroup().addTo(map);
  userLayer = L.layerGroup().addTo(map);
  updateMarkers();
  updateUserMarker();
  if (loc) hasCenteredOnUser = true;

  setTimeout(() => map?.invalidateSize(), 100);
}

onMounted(initMap);

onUnmounted(() => {
  map?.remove();
  map = null;
});

watch(() => props.earthquakes, updateMarkers, { deep: true });
watch(() => props.userLocation, updateUserMarker, { deep: true });
</script>

<template>
  <div class="viz-card">
    <div class="viz-card__header">
      <h4>Earthquake map ({{ timeframeLabel }})</h4>
      <p>
        M2.5+ epicenters · disk ≈ felt range · purple = you · blue M2.5–4 · green M4–6 · red
        M6+
      </p>
    </div>
    <div class="viz-legend">
      <span class="viz-legend__swatch viz-legend__swatch--you" /> You
      <span class="viz-legend__swatch viz-legend__swatch--blue" /> M2.5–4
      <span class="viz-legend__swatch viz-legend__swatch--green" /> M4–6
      <span class="viz-legend__swatch viz-legend__swatch--red" /> M6+
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

.viz-legend {
  display: flex;
  align-items: center;
  gap: 0.5rem 1rem;
  flex-wrap: wrap;
  padding: 0.5rem 1rem 0;
  font-size: 0.6875rem;
  color: var(--dash-muted);
}

.viz-legend__swatch {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 0.25rem;
}

.viz-legend__swatch--you {
  background: #c4b5fd;
  box-shadow: 0 0 6px #c4b5fd;
}

.viz-legend__swatch--blue {
  background: #00e5ff;
  box-shadow: 0 0 6px #00e5ff;
}

.viz-legend__swatch--green {
  background: #39ff14;
  box-shadow: 0 0 6px #39ff14;
}

.viz-legend__swatch--red {
  background: #ff1744;
  box-shadow: 0 0 6px #ff1744;
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

:deep(.quake-map-popup .leaflet-popup-content-wrapper),
:deep(.quake-map-tooltip) {
  background: #1a1d26;
  color: #eef0f4;
  border: 1px solid #2d3340;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
}

:deep(.quake-map-popup .leaflet-popup-tip) {
  background: #1a1d26;
  border: 1px solid #2d3340;
}

:deep(.quake-map-popup .leaflet-popup-content) {
  margin: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: #eef0f4;
}

:deep(.quake-map-popup .leaflet-popup-content strong) {
  font-weight: 600;
  color: #eef0f4;
}
</style>
