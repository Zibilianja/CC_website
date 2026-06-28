<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { WeatherAlert } from '../../types/spaceWeather';
import { resolveAlertMap } from '../../services/spaceWeather/alertZones';

const props = defineProps<{
  alert: WeatherAlert | null;
}>();

const mapRef = ref<HTMLElement | null>(null);
const caption = ref('Select an alert to view its area');
const mapNote = ref('');
let map: L.Map | null = null;
let areaLayer: L.LayerGroup | null = null;
let resolveToken = 0;

const US_CENTER: [number, number] = [39.5, -98.35];
const US_ZOOM = 4;

function severityColor(severity: string): string {
  const s = severity.toLowerCase();
  if (s === 'extreme') return '#a855f7';
  if (s === 'severe') return '#ef4444';
  if (s === 'moderate') return '#f97316';
  return '#eab308';
}

function drawGeometry(geometry: WeatherAlert['geometry'], color: string) {
  if (!map || !areaLayer || !geometry) return;

  L.geoJSON(
    {
      type: 'Feature',
      geometry: {
        type: geometry.type,
        coordinates: geometry.coordinates,
      },
      properties: {},
    } as GeoJSON.Feature,
    {
      style: {
        color,
        fillColor: color,
        fillOpacity: 0.14,
        weight: 2,
        opacity: 0.9,
      },
    }
  ).addTo(areaLayer);
}

function fitLayerBounds() {
  if (!map || !areaLayer) return;

  const layers = areaLayer.getLayers();
  if (!layers.length) {
    map.setView(US_CENTER, US_ZOOM);
    return;
  }

  const group = L.featureGroup(layers as L.Layer[]);
  const bounds = group.getBounds();
  if (bounds.isValid()) {
    map.fitBounds(bounds.pad(0.1), { maxZoom: 9 });
  }
}

async function updateArea() {
  if (!map || !areaLayer) return;

  const token = ++resolveToken;
  areaLayer.clearLayers();
  mapNote.value = '';

  const alert = props.alert;
  if (!alert) {
    caption.value = 'Select an alert to view its area';
    map.setView(US_CENTER, US_ZOOM);
    return;
  }

  caption.value = 'Loading map…';
  const resolved = await resolveAlertMap(alert);
  if (token !== resolveToken) return;

  caption.value = resolved.caption;
  const color = severityColor(alert.severity);

  for (const geometry of resolved.geometries) {
    drawGeometry(geometry, color);
  }

  if (resolved.point) {
    L.circleMarker([resolved.point.latitude, resolved.point.longitude], {
      radius: 9,
      color,
      fillColor: color,
      fillOpacity: 0.85,
      weight: 2,
    })
      .bindTooltip('Approximate area center', { direction: 'top' })
      .addTo(areaLayer);

    if (!resolved.geometries.length) {
      map.setView([resolved.point.latitude, resolved.point.longitude], 8);
    }
  }

  if (resolved.geometries.length) {
    fitLayerBounds();
  } else if (!resolved.point) {
    map.setView(US_CENTER, US_ZOOM);
  }

  if (resolved.source === 'geocode') {
    mapNote.value = 'Pin shows approximate center — zone outline unavailable.';
  } else if (resolved.source === 'none') {
    mapNote.value = 'Could not resolve map boundaries for this alert.';
  }
}

function initMap() {
  if (!mapRef.value || map) return;

  map = L.map(mapRef.value, {
    center: US_CENTER,
    zoom: US_ZOOM,
    minZoom: 3,
    maxZoom: 10,
    scrollWheelZoom: false,
    worldCopyJump: false,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  areaLayer = L.layerGroup().addTo(map);
  void updateArea();

  setTimeout(() => map?.invalidateSize(), 100);
}

onMounted(initMap);

onUnmounted(() => {
  map?.remove();
  map = null;
});

watch(() => props.alert, () => void updateArea(), { deep: true });
</script>

<template>
  <div class="alert-area-map">
    <div ref="mapRef" class="alert-area-map__canvas" />
    <p class="alert-area-map__caption">{{ caption }}</p>
    <p v-if="mapNote" class="alert-area-map__note">{{ mapNote }}</p>
  </div>
</template>

<style scoped>
.alert-area-map {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.alert-area-map__canvas {
  width: 100%;
  height: 280px;
  border-radius: var(--site-radius-sm);
  overflow: hidden;
}

.alert-area-map__caption {
  font-size: 0.6875rem;
  color: var(--dash-muted);
  margin: 0.5rem 0 0;
  line-height: 1.4;
}

.alert-area-map__note {
  font-size: 0.625rem;
  color: var(--dash-muted);
  font-style: italic;
  margin: 0.25rem 0 0;
}

:deep(.leaflet-container) {
  background: #0f1117;
  font-family: var(--site-font);
}
</style>
