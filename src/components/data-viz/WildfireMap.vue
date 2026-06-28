<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { WildfireEvent } from '../../types/spaceWeather';

const props = defineProps<{
  fires: WildfireEvent[];
  regionCount?: number;
  cappedRegions?: string[];
}>();

const mapRef = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let layer: L.LayerGroup | null = null;

const MIN_ZOOM = 2;
const DEFAULT_CENTER: [number, number] = [39.5, -98.35];
const DEFAULT_ZOOM = 4;

const locatedCount = computed(
  () =>
    props.fires.filter(
      (f) =>
        f.geometry != null || (f.latitude != null && f.longitude != null)
    ).length
);

const captionNote = computed(() => {
  const regions = props.regionCount ?? 0;
  if (regions <= 0) {
    return 'NASA EONET — each API query returns at most 100 events (no pagination).';
  }
  let note = `${props.fires.length} unique events merged from ${regions} regional queries (EONET limit: 100 per query).`;
  if (props.cappedRegions?.length) {
    note += ` Some regions may be truncated: ${props.cappedRegions.join(', ')}.`;
  }
  return note;
});

function fireStyle() {
  return {
    color: '#fb923c',
    fillColor: '#f97316',
    fillOpacity: 0.22,
    weight: 2,
    opacity: 0.95,
  };
}

function drawFire(fire: WildfireEvent) {
  if (!layer) return;

  if (fire.geometry?.type === 'Point' && Array.isArray(fire.geometry.coordinates)) {
    const coords = fire.geometry.coordinates as number[];
    if (coords.length >= 2) {
      L.circleMarker([coords[1], coords[0]], {
        radius: 8,
        color: '#fb923c',
        fillColor: '#ef4444',
        fillOpacity: 0.85,
        weight: 2,
      })
        .bindPopup(
          `<strong>${fire.title}</strong><br><small>Updated ${fire.date}</small>`
        )
        .addTo(layer);
    }
    return;
  }

  if (fire.geometry && fire.geometry.type !== 'Point') {
    L.geoJSON(
      {
        type: 'Feature',
        geometry: {
          type: fire.geometry.type,
          coordinates: fire.geometry.coordinates,
        },
        properties: { title: fire.title },
      } as GeoJSON.Feature,
      { style: fireStyle }
    )
      .bindPopup(
        `<strong>${fire.title}</strong><br><small>Updated ${fire.date}</small>`
      )
      .addTo(layer);
    return;
  }

  const lat = fire.latitude;
  const lon = fire.longitude;
  if (lat == null || lon == null) return;

  L.circleMarker([lat, lon], {
    radius: 8,
    color: '#fb923c',
    fillColor: '#ef4444',
    fillOpacity: 0.85,
    weight: 2,
  })
    .bindPopup(
      `<strong>${fire.title}</strong><br><small>Updated ${fire.date}</small>`
    )
    .addTo(layer);
}

function updateMap() {
  if (!map || !layer) return;
  layer.clearLayers();

  const mappable = props.fires.filter(
    (f) =>
      f.geometry != null || (f.latitude != null && f.longitude != null)
  );

  for (const fire of mappable) {
    drawFire(fire);
  }

  if (mappable.length === 1 && mappable[0].latitude != null && mappable[0].longitude != null) {
    map.setView(
      [mappable[0].latitude, mappable[0].longitude],
      Math.max(5, MIN_ZOOM)
    );
    return;
  }

  if (mappable.length > 1 && layer.getLayers().length) {
    const group = L.featureGroup(layer.getLayers() as L.Layer[]);
    const bounds = group.getBounds();
    if (bounds.isValid()) {
      const lngSpan = bounds.getEast() - bounds.getWest();
      if (lngSpan > 120) {
        map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      } else {
        map.fitBounds(bounds.pad(0.15), { maxZoom: 7 });
      }
    }
    return;
  }

  map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
}

function initMap() {
  if (!mapRef.value || map) return;

  map = L.map(mapRef.value, {
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    minZoom: MIN_ZOOM,
    maxZoom: 9,
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
  updateMap();

  setTimeout(() => map?.invalidateSize(), 100);
}

onMounted(initMap);

onUnmounted(() => {
  map?.remove();
  map = null;
});

watch(() => props.fires, updateMap, { deep: true });
</script>

<template>
  <div class="viz-card">
    <div class="viz-card__header">
      <h4>Active wildfires</h4>
      <p>
        {{ locatedCount }} of {{ fires.length }} mapped
        (perimeters when reported; otherwise a point marker).
        {{ captionNote }}
      </p>
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

.map-canvas {
  width: 100%;
  height: 320px;
  margin-top: 0.5rem;
}

:deep(.leaflet-container) {
  background: #0f1117;
  font-family: var(--site-font);
}
</style>
