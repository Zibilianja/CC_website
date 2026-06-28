import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import {
  fetchAuroraLayer,
  fetchGroundLayer,
  fetchMagnetosphereLayer,
  fetchSolarLayer,
  fetchSubsurfaceLayer,
  fetchTroposphereLayer,
} from '../services/spaceWeather';
import type {
  AuroraLayerData,
  DashboardSnapshot,
  FetchStatus,
  GroundLayerData,
  LayerId,
  LayerState,
  MagnetosphereLayerData,
  SolarLayerData,
  SubsurfaceLayerData,
  TroposphereLayerData,
} from '../types/spaceWeather';

function emptyLayer<T>(): LayerState<T> {
  return { status: 'idle', error: null, data: null, fetchedAt: null };
}

export const useSpaceWeatherDashboard = defineStore('spaceWeatherDashboard', () => {
  const solar = ref<LayerState<SolarLayerData>>(emptyLayer());
  const magnetosphere = ref<LayerState<MagnetosphereLayerData>>(emptyLayer());
  const aurora = ref<LayerState<AuroraLayerData>>(emptyLayer());
  const troposphere = ref<LayerState<TroposphereLayerData>>(emptyLayer());
  const ground = ref<LayerState<GroundLayerData>>(emptyLayer());
  const subsurface = ref<LayerState<SubsurfaceLayerData>>(emptyLayer());

  const hasLoaded = ref(false);
  const isLoading = ref(false);

  const snapshot = computed<DashboardSnapshot>(() => ({
    solar: solar.value,
    magnetosphere: magnetosphere.value,
    aurora: aurora.value,
    troposphere: troposphere.value,
    ground: ground.value,
    subsurface: subsurface.value,
  }));

  const snapshotAt = computed(() => {
    const times = Object.values(snapshot.value)
      .map((layer) => layer.fetchedAt)
      .filter(Boolean) as string[];
    if (!times.length) return null;
    return times[times.length - 1] ?? null;
  });

  const anyLoading = computed(() =>
    Object.values(snapshot.value).some((layer) => layer.status === 'loading')
  );

  async function fetchLayer<T>(
    layerRef: { value: LayerState<T> },
    fetcher: () => Promise<T>
  ) {
    layerRef.value = {
      ...layerRef.value,
      status: 'loading',
      error: null,
    };

    try {
      const data = await fetcher();
      layerRef.value = {
        status: 'success',
        error: null,
        data,
        fetchedAt: new Date().toISOString(),
      };
    } catch (err) {
      layerRef.value = {
        ...layerRef.value,
        status: 'error',
        error: err instanceof Error ? err.message : 'Failed to load data',
      };
    }
  }

  async function loadSnapshot() {
    if (hasLoaded.value || isLoading.value) return;

    isLoading.value = true;
    await Promise.all([
      fetchLayer(solar, fetchSolarLayer),
      fetchLayer(magnetosphere, fetchMagnetosphereLayer),
      fetchLayer(aurora, fetchAuroraLayer),
      fetchLayer(troposphere, fetchTroposphereLayer),
      fetchLayer(ground, fetchGroundLayer),
      fetchLayer(subsurface, fetchSubsurfaceLayer),
    ]);
    hasLoaded.value = true;
    isLoading.value = false;
  }

  function layerStatus(id: LayerId): FetchStatus {
    return snapshot.value[id].status;
  }

  return {
    solar,
    magnetosphere,
    aurora,
    troposphere,
    ground,
    subsurface,
    snapshot,
    snapshotAt,
    hasLoaded,
    isLoading,
    anyLoading,
    loadSnapshot,
    layerStatus,
  };
});
