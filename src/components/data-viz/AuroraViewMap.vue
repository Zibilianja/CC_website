<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { AuroraPoint } from '../../types/spaceWeather';
import {
  buildViewingOpportunityCanvas,
  canvasToDataUrl,
  viewingPercentAt,
} from '../../utils/auroraViewing';
import { AURORA_CITIES } from '../../constants/auroraCities';

const props = defineProps<{
  points: AuroraPoint[];
  maxIntensity: number;
}>();

const mapRef = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let overlay: L.ImageOverlay | null = null;
let cityLayer: L.LayerGroup | null = null;

function buildOverlayUrl(): string {
  const canvas = buildViewingOpportunityCanvas(props.points, props.maxIntensity);
  return canvasToDataUrl(canvas);
}

function initMap() {
  if (!mapRef.value || map) return;

  map = L.map(mapRef.value, {
    center: [62, -25],
    zoom: 3,
    minZoom: 2,
    maxZoom: 6,
    scrollWheelZoom: false,
    worldCopyJump: true,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  cityLayer = L.layerGroup().addTo(map);
  updateOverlay();

  setTimeout(() => map?.invalidateSize(), 100);
}

function cityMarkerLabel(name: string, probability: number): string {
  return `<strong>${name}</strong><br>${probability}% viewing chance`;
}

function updateOverlay() {
  if (!map) return;

  overlay?.remove();
  overlay = L.imageOverlay(
    buildOverlayUrl(),
    [
      [-90, -180],
      [90, 180],
    ],
    { opacity: 0.85, interactive: false, className: 'aurora-view-overlay' }
  );
  overlay.addTo(map);

  if (cityLayer) {
    cityLayer.clearLayers();
    for (const city of AURORA_CITIES) {
      const probability = viewingPercentAt(
        props.points,
        city.lat,
        city.lon,
        props.maxIntensity
      );
      L.circleMarker([city.lat, city.lon], {
        radius: 4,
        color: '#fbbf24',
        fillColor: '#fbbf24',
        fillOpacity: 0.9,
        weight: 1,
      })
        .bindTooltip(`${city.name} — ${probability}% viewing chance`, {
          direction: 'top',
          className: 'aurora-city-tooltip',
        })
        .bindPopup(cityMarkerLabel(city.name, probability), {
          className: 'aurora-city-popup',
        })
        .addTo(cityLayer);
    }
  }
}

onMounted(initMap);

onUnmounted(() => {
  map?.remove();
  map = null;
});

watch(
  () => [props.points, props.maxIntensity],
  () => {
    updateOverlay();
    setTimeout(() => map?.invalidateSize(), 50);
  },
  { deep: true }
);
</script>

<template>
  <div class="viz-card">
    <div class="viz-card__header">
      <h4>Viewing opportunity map</h4>
      <p>
        Green shading = estimated ground viewing chance (aurora overhead or on
        the poleward horizon, poleward of ~45°). Gold = reference cities.
      </p>
    </div>
    <div class="viz-legend">
      <span class="viz-legend__swatch viz-legend__swatch--high" /> Strong
      <span class="viz-legend__swatch viz-legend__swatch--mid" /> Moderate
      <span class="viz-legend__swatch viz-legend__swatch--low" /> Low
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
  border-radius: 3px;
  margin-right: 0.25rem;
}

.viz-legend__swatch--high {
  background: rgba(120, 255, 180, 0.9);
}

.viz-legend__swatch--mid {
  background: rgba(80, 200, 130, 0.55);
}

.viz-legend__swatch--low {
  background: rgba(60, 140, 90, 0.35);
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

:deep(.aurora-view-overlay) {
  mix-blend-mode: screen;
  pointer-events: none;
}

:deep(.aurora-city-popup .leaflet-popup-content-wrapper),
:deep(.aurora-city-tooltip) {
  background: #1a1d26;
  color: #eef0f4;
  border: 1px solid #2d3340;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
}

:deep(.aurora-city-popup .leaflet-popup-tip) {
  background: #1a1d26;
  border: 1px solid #2d3340;
  box-shadow: none;
}

:deep(.aurora-city-popup .leaflet-popup-content),
:deep(.aurora-city-tooltip) {
  margin: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: #eef0f4;
}

:deep(.aurora-city-popup .leaflet-popup-content strong) {
  font-weight: 600;
  color: #eef0f4;
}
</style>
