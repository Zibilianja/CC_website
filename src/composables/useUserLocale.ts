import { computed, inject, provide, ref, type ComputedRef, type InjectionKey, type Ref } from 'vue';
import { NEARBY_EARTHQUAKE_RADIUS_KM } from '../utils/earthquake';
import { resolveLocationSearch } from '../services/spaceWeather/locationSearch';
import {
  formatDepth,
  formatDistance,
  formatRadiusLabel,
  formatTemperature,
  formatWindSpeed,
  formatWind,
  resolveUnitSystem,
  type UnitSystem,
} from '../utils/localeUnits';
import {
  useUserLocation,
  type UserLocation,
  type UserLocationStatus,
} from './useUserLocation';

export interface UserLocaleContext {
  location: Ref<UserLocation | null>;
  locationStatus: Ref<UserLocationStatus>;
  locationError: Ref<string | null>;
  hasLocation: ComputedRef<boolean>;
  locationLabel: ComputedRef<string>;
  locationPickerOpen: Ref<boolean>;
  requestLocation: () => void;
  setManualLocation: (location: UserLocation) => void;
  setLocationFromSearch: (query: string) => Promise<void>;
  setLocationFromMap: (latitude: number, longitude: number) => void;
  openLocationPicker: () => void;
  unitSystem: ComputedRef<UnitSystem>;
  formatTemperature: (celsius: number) => string;
  formatDistance: (km: number) => string;
  formatDepth: (depthKm: number) => string;
  formatWindSpeed: (metersPerSecond: number) => string;
  formatWind: (metersPerSecond: number, degrees: number) => string;
  nearbyRadiusLabel: ComputedRef<string>;
}

export const USER_LOCALE_KEY: InjectionKey<UserLocaleContext> = Symbol('userLocale');

export function provideUserLocale(): UserLocaleContext {
  const { location, status, error, request, setManualLocation } = useUserLocation();
  const locationPickerOpen = ref(false);

  const unitSystem = computed(() => resolveUnitSystem(location.value));

  const hasLocation = computed(() => location.value != null);

  const locationLabel = computed(() => {
    const loc = location.value;
    if (!loc) return '';
    if (loc.label) return loc.label;
    if (loc.zipCode) return `ZIP ${loc.zipCode}`;
    return `${loc.latitude.toFixed(2)}°, ${loc.longitude.toFixed(2)}°`;
  });

  async function setLocationFromSearch(query: string) {
    const resolved = await resolveLocationSearch(query);
    setManualLocation(resolved);
    locationPickerOpen.value = false;
    error.value = null;
  }

  function setLocationFromMap(latitude: number, longitude: number) {
    setManualLocation({
      latitude,
      longitude,
      label: `Map pin (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`,
      source: 'map',
    });
    locationPickerOpen.value = false;
    error.value = null;
  }

  function openLocationPicker() {
    locationPickerOpen.value = true;
  }

  const ctx: UserLocaleContext = {
    location,
    locationStatus: status,
    locationError: error,
    hasLocation,
    locationLabel,
    locationPickerOpen,
    requestLocation: request,
    setManualLocation,
    setLocationFromSearch,
    setLocationFromMap,
    openLocationPicker,
    unitSystem,
    formatTemperature: (celsius) => formatTemperature(celsius, unitSystem.value),
    formatDistance: (km) => formatDistance(km, unitSystem.value),
    formatDepth: (depthKm) => formatDepth(depthKm, unitSystem.value),
    formatWindSpeed: (mps) => formatWindSpeed(mps, unitSystem.value),
    formatWind: (mps, deg) => formatWind(mps, deg, unitSystem.value),
    nearbyRadiusLabel: computed(() =>
      formatRadiusLabel(NEARBY_EARTHQUAKE_RADIUS_KM, unitSystem.value)
    ),
  };

  provide(USER_LOCALE_KEY, ctx);
  return ctx;
}

export function useUserLocale(): UserLocaleContext {
  const ctx = inject(USER_LOCALE_KEY);
  if (!ctx) {
    throw new Error('useUserLocale() must be used within SpaceWeatherDashboard.');
  }
  return ctx;
}
