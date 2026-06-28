import { computed, ref, watch, type Ref } from 'vue';
import { fetchLocalWeather } from '../services/spaceWeather/localWeather';
import { uvRiskLabel } from '../services/spaceWeather/openWeatherClient';
import type { OpenWeatherSnapshot, WeatherAlert } from '../types/spaceWeather';
import { isLocationInUnitedStates } from '../utils/localeUnits';
import { useUserLocale } from './useUserLocale';

interface LocalWeatherState {
  weather: Ref<OpenWeatherSnapshot | null>;
  alerts: Ref<WeatherAlert[]>;
  status: Ref<'idle' | 'loading' | 'success' | 'error'>;
  error: Ref<string | null>;
  location: ReturnType<typeof useUserLocale>['location'];
  locationStatus: ReturnType<typeof useUserLocale>['locationStatus'];
  hasLocation: ReturnType<typeof useUserLocale>['hasLocation'];
  requestLocation: () => void;
  alertsAvailable: Ref<boolean>;
  formatTemperature: (celsius: number) => string;
  windDisplay: Ref<string>;
  airQualityDisplay: Ref<string>;
  uvDisplay: Ref<string>;
  precipDisplay: Ref<string>;
  load: () => Promise<void>;
}

let shared: LocalWeatherState | null = null;

export function useLocalWeather(): LocalWeatherState {
  if (shared) return shared;

  const {
    location,
    locationStatus,
    hasLocation,
    requestLocation,
    formatTemperature,
    formatWind,
  } = useUserLocale();

  const weather = ref<OpenWeatherSnapshot | null>(null);
  const alerts = ref<WeatherAlert[]>([]);
  const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle');
  const error = ref<string | null>(null);

  const alertsAvailable = computed(() => {
    if (!location.value) return false;
    return isLocationInUnitedStates(
      location.value.latitude,
      location.value.longitude
    );
  });

  const windDisplay = computed(() => {
    if (!weather.value) return '—';
    return formatWind(weather.value.windSpeed, weather.value.windDeg);
  });

  const airQualityDisplay = computed(() => {
    const w = weather.value;
    if (!w?.airQualityIndex) return '—';
    return w.airQualityLabel
      ? `${w.airQualityLabel} (${w.airQualityIndex}/5)`
      : `${w.airQualityIndex}/5`;
  });

  const uvDisplay = computed(() => {
    const uvi = weather.value?.uvIndex;
    if (uvi == null) return '—';
    return `${uvi.toFixed(1)} · ${uvRiskLabel(uvi)}`;
  });

  const precipDisplay = computed(() => {
    const pop = weather.value?.precipChance;
    if (pop == null) return '—';
    return `${pop}%`;
  });

  async function load() {
    if (!location.value) return;

    status.value = 'loading';
    error.value = null;

    try {
      const result = await fetchLocalWeather(
        location.value.latitude,
        location.value.longitude
      );
      weather.value = result.weather;
      alerts.value = result.alerts;
      error.value = result.error;
      status.value = result.weather ? 'success' : 'error';
    } catch (err) {
      weather.value = null;
      alerts.value = [];
      status.value = 'error';
      error.value = err instanceof Error ? err.message : 'Failed to load local weather';
    }
  }

  watch(
    location,
    (loc) => {
      if (loc) void load();
      else {
        weather.value = null;
        alerts.value = [];
        status.value = 'idle';
        error.value = null;
      }
    },
    { immediate: true }
  );

  shared = {
    weather,
    alerts,
    status,
    error,
    location,
    locationStatus,
    hasLocation,
    requestLocation,
    alertsAvailable,
    formatTemperature,
    windDisplay,
    airQualityDisplay,
    uvDisplay,
    precipDisplay,
    load,
  };

  return shared;
}
