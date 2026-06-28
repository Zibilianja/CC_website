<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import type { AuroraPoint } from '../../types/spaceWeather';
import { createGlobeScene } from '../../composables/useThreeGlobe';
import { AURORA_CITIES } from '../../constants/auroraCities';
import { sampleGlobeActivityMarkers } from '../../utils/auroraViewing';

const props = defineProps<{
  activityPoints: AuroraPoint[];
}>();

const containerRef = ref<HTMLElement | null>(null);
const manuallyPaused = ref(false);
let globe: ReturnType<typeof createGlobeScene> | null = null;

const maxIntensity = computed(() =>
  props.activityPoints.reduce((max, p) => Math.max(max, p.intensity), 0) || 1
);

/** Pale mint → green → bright yellow-green by relative OVATION intensity. */
function auroraColor(intensity: number): string {
  const t = Math.min(1, intensity / maxIntensity.value);
  const hue = 152 - t * 62;
  const saturation = 58 + t * 24;
  const lightness = 42 + t * 22;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function auroraOpacity(intensity: number): number {
  const t = Math.min(1, intensity / maxIntensity.value);
  return 0.2 + t * 0.35;
}

function updateGlobe() {
  if (!globe) return;

  globe.setAuroraOverlay(null);

  const auroraMarkers = sampleGlobeActivityMarkers(props.activityPoints, 3000).map(
    (p) => ({
      lat: p.latitude,
      lon: p.longitude,
      color: auroraColor(p.intensity),
      size: Math.min(3.2, 0.55 + p.intensity * 0.3),
      opacity: auroraOpacity(p.intensity),
    })
  );

  const cityMarkers = AURORA_CITIES.map((city) => ({
    lat: city.lat,
    lon: city.lon,
    color: '#fbbf24',
    size: 1.35,
    opacity: 1,
  }));

  globe.setMarkers(auroraMarkers);
  globe.setCityMarkers(cityMarkers);
}

function toggleRotation() {
  if (!globe) return;
  manuallyPaused.value = !manuallyPaused.value;
  globe.setManuallyPaused(manuallyPaused.value);
}

onMounted(() => {
  if (!containerRef.value) return;
  globe = createGlobeScene(containerRef.value, {
    cameraZ: 3.45,
    resumeAfterDragMs: 5000,
  });
  updateGlobe();
});

onUnmounted(() => {
  globe?.dispose();
});

watch(() => props.activityPoints, updateGlobe, { deep: true });
</script>

<template>
  <div class="viz-card">
    <div class="viz-card__header">
      <h4>Aurora activity (OVATION model)</h4>
      <p>
        Drag to rotate · translucent green = aurora intensity (pale → bright)
        · gold = reference cities
      </p>
    </div>
    <div class="globe-canvas">
      <div ref="containerRef" class="globe-canvas__view" />
      <button
        type="button"
        class="globe-rotate-btn"
        :aria-label="manuallyPaused ? 'Resume rotation' : 'Pause rotation'"
        :title="manuallyPaused ? 'Resume rotation' : 'Pause rotation'"
        @click="toggleRotation"
      >
        <svg
          v-if="manuallyPaused"
          class="globe-rotate-btn__icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M8 5v14l11-7z" fill="currentColor" />
        </svg>
        <svg
          v-else
          class="globe-rotate-btn__icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M6 5h4v14H6zm8 0h4v14h-4z" fill="currentColor" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.viz-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--dash-border);
  border-radius: var(--site-radius);
  background: var(--dash-surface);
  overflow: hidden;
  min-width: 0;
  min-height: 0;
  height: 100%;
}

.viz-card__header {
  flex-shrink: 0;
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

.globe-canvas {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 320px;
  padding: 0 2rem 1rem;
  box-sizing: border-box;
}

.globe-canvas__view {
  width: 100%;
  height: 100%;
  min-height: 0;
  cursor: grab;
}

.globe-canvas__view:active {
  cursor: grabbing;
}

.globe-rotate-btn {
  position: absolute;
  right: 2.5rem;
  bottom: 1.25rem;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: 1px solid var(--dash-border);
  border-radius: var(--site-radius);
  background: rgba(26, 29, 38, 0.88);
  color: var(--dash-text);
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.globe-rotate-btn:hover {
  background: rgba(36, 40, 52, 0.95);
  border-color: var(--dash-text-secondary);
}

.globe-rotate-btn__icon {
  width: 0.875rem;
  height: 0.875rem;
}
</style>
