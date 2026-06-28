<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useSpaceWeatherDashboard } from '../../stores/useSpaceWeatherDashboard';
import { useLayerScrollSpy } from '../../composables/useLayerScrollSpy';
import { provideUserLocale } from '../../composables/useUserLocale';
import { buildCascadeSummary } from '../../utils/layerNarratives';
import { LAYER_META } from '../../constants/layerMeta';
import type { LayerId } from '../../types/spaceWeather';
import CascadeSpine from './CascadeSpine.vue';
import CorrelationTimeline from './CorrelationTimeline.vue';
import LayerSection from './LayerSection.vue';
import SolarLayerPanel from './SolarLayerPanel.vue';
import MagnetosphereLayerPanel from './MagnetosphereLayerPanel.vue';
import AuroraLayerPanel from './AuroraLayerPanel.vue';
import TroposphereLayerPanel from './TroposphereLayerPanel.vue';
import GroundLayerPanel from './GroundLayerPanel.vue';
import SubsurfaceLayerPanel from './SubsurfaceLayerPanel.vue';

import LocationSelector from './LocationSelector.vue';

const store = useSpaceWeatherDashboard();
const { activeLayer, navigateTo } = useLayerScrollSpy();
const { unitSystem } = provideUserLocale();

const summaryLine = computed(() =>
  buildCascadeSummary(
    store.solar.data,
    store.magnetosphere.data,
    store.troposphere.data,
    unitSystem.value
  )
);

const snapshotLabel = computed(() => {
  if (!store.snapshotAt) return null;
  return new Date(store.snapshotAt).toLocaleString([], {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
});

const panelMap: Record<LayerId, typeof SolarLayerPanel> = {
  solar: SolarLayerPanel,
  magnetosphere: MagnetosphereLayerPanel,
  aurora: AuroraLayerPanel,
  troposphere: TroposphereLayerPanel,
  ground: GroundLayerPanel,
  subsurface: SubsurfaceLayerPanel,
};

onMounted(() => {
  void store.loadSnapshot();
});
</script>

<template>
  <div class="space-weather-dashboard">
    <div class="dashboard-hero">
      <p class="dashboard-hero__eyebrow">Space Weather → Ground Weather</p>
      <h2 class="dashboard-hero__title">
        A 400,000 km vertical column of interconnected systems
      </h2>
      <p class="dashboard-hero__thesis">
        Earth's weather doesn't exist in isolation. Disturbances propagate from
        the Sun through interplanetary space, the magnetosphere, and the upper
        atmosphere before they influence what we experience at the surface.
        This page walks that cascade from top to bottom.
      </p>
      <p class="dashboard-hero__hook">
        Most weather apps show you rain or shine. This shows the full stack —
        from solar flares to geomagnetic storms to surface alerts.
      </p>

      <div class="dashboard-hero__strip">
        <p class="dashboard-hero__summary">{{ summaryLine }}</p>
        <p v-if="snapshotLabel" class="dashboard-hero__snapshot">
          Snapshot taken {{ snapshotLabel }}. Reload the page to refresh.
        </p>
      </div>

      <LocationSelector class="dashboard-hero__location" />
    </div>

    <CascadeSpine :active-layer="activeLayer" @navigate="navigateTo" />

    <CorrelationTimeline />

    <div class="dashboard-layers">
      <LayerSection
        v-for="(meta, index) in LAYER_META"
        :key="meta.id"
        :meta="meta"
        :layer-index="index + 1"
      >
        <component :is="panelMap[meta.id]" />
      </LayerSection>
    </div>

    <footer class="dashboard-footer">
      <p>
        Data from NASA, NOAA, USGS, and partner agencies. Visualizations use
        Three.js, Leaflet, and Chart.js. Reload the page to fetch a new snapshot.
      </p>
    </footer>
  </div>
</template>

<style scoped>
.space-weather-dashboard {
  --dash-bg: #0f1117;
  --dash-surface: #171a22;
  --dash-border: #2a2f3d;
  --dash-text: #eef0f4;
  --dash-text-secondary: #a8adb8;
  --dash-muted: #6b7280;
  --dash-accent: #4f7cff;
  --dash-success: #34d399;
  --dash-danger: #f87171;

  margin-inline: calc(-1 * var(--site-content-padding));
  padding: 2.5rem var(--site-content-padding) 3rem;
  background: var(--dash-bg);
  color: var(--dash-text);
  border-radius: var(--site-radius-xl);
}

.dashboard-hero {
  max-width: 68ch;
  margin-bottom: 2rem;
}

.dashboard-hero__eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--dash-accent);
  margin-bottom: 0.75rem;
}

.dashboard-hero__title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  color: var(--dash-text);
  margin-bottom: 1rem;
}

.dashboard-hero__thesis,
.dashboard-hero__hook {
  font-size: 1rem;
  line-height: 1.65;
  color: var(--dash-text-secondary);
}

.dashboard-hero__hook {
  margin-top: 0.75rem;
  font-style: italic;
}

.dashboard-hero__strip {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-top: 1.5rem;
  padding: 1rem 1.125rem;
  background: var(--dash-surface);
  border: 1px solid var(--dash-border);
  border-radius: var(--site-radius);
}

.dashboard-hero__summary {
  font-size: 1rem;
  font-weight: 500;
  color: var(--dash-text);
  line-height: 1.5;
}

.dashboard-hero__snapshot {
  font-size: 0.8125rem;
  color: var(--dash-muted);
}

.dashboard-hero__location {
  margin-top: 1rem;
}

.dashboard-layers {
  scroll-margin-top: calc(var(--site-header-height) + 4rem);
}

.dashboard-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--dash-border);
}

.dashboard-footer p {
  font-size: 0.8125rem;
  color: var(--dash-muted);
  max-width: 60ch;
}
</style>
