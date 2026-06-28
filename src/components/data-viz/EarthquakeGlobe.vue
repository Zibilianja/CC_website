<script setup lang="ts">

import { onMounted, onUnmounted, ref, watch } from 'vue';

import type { EarthquakeFeature } from '../../types/spaceWeather';

import { createGlobeScene } from '../../composables/useThreeGlobe';
import { magnitudeColor, visibleEarthquakes } from '../../utils/earthquake';
import type { UserLocation } from '../../composables/useUserLocation';

const props = defineProps<{
  earthquakes: EarthquakeFeature[];
  timeframeLabel: string;
  userLocation?: UserLocation | null;
}>();



const containerRef = ref<HTMLElement | null>(null);

const manuallyPaused = ref(false);

let globe: ReturnType<typeof createGlobeScene> | null = null;



function updateGlobe() {
  if (!globe) return;

  globe.setEarthquakeEvents(
    visibleEarthquakes(props.earthquakes).map((q) => ({
      lat: q.latitude,
      lon: q.longitude,
      magnitude: q.magnitude,
      color: magnitudeColor(q.magnitude),
    }))
  );

  const loc = props.userLocation;
  globe.setUserMarker(loc?.latitude ?? null, loc?.longitude ?? null);
}



function toggleRotation() {

  if (!globe) return;

  manuallyPaused.value = !manuallyPaused.value;

  globe.setManuallyPaused(manuallyPaused.value);

}



onMounted(() => {

  if (!containerRef.value) return;

  globe = createGlobeScene(containerRef.value, {
    resumeAfterDragMs: 5000,
    enableZoom: true,
  });

  updateGlobe();

});



onUnmounted(() => {

  globe?.dispose();

});



watch(() => [props.earthquakes, props.userLocation] as const, updateGlobe, { deep: true });

</script>



<template>

  <div class="viz-card">

    <div class="viz-card__header">

      <h4>Earthquake globe ({{ timeframeLabel }})</h4>

      <p>

        Drag to rotate · scroll to zoom · M2.5+ · dot = epicenter · disk ≈ felt range ·
        purple = you · blue M2.5–4 · green M4–6 · red M6+

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



.globe-canvas {

  position: relative;

  width: 100%;

  height: 320px;

  cursor: grab;

}



.globe-canvas__view {

  width: 100%;

  height: 100%;

}



.globe-canvas__view:active {

  cursor: grabbing;

}



.globe-rotate-btn {

  position: absolute;

  right: 0.75rem;

  bottom: 0.75rem;

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

