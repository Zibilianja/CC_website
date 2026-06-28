import { computed, onMounted, ref } from 'vue';

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracyM?: number;
  zipCode?: string;
  label?: string;
  source?: 'geolocation' | 'zip' | 'city' | 'map';
}

export type UserLocationStatus =
  | 'idle'
  | 'pending'
  | 'granted'
  | 'denied'
  | 'unavailable';

export function useUserLocation(options: { requestOnMount?: boolean } = {}) {
  const { requestOnMount = true } = options;

  const geoLocation = ref<UserLocation | null>(null);
  const manualLocation = ref<UserLocation | null>(null);
  const location = computed(() => manualLocation.value ?? geoLocation.value);

  const status = ref<UserLocationStatus>('idle');
  const error = ref<string | null>(null);

  function setManualLocation(next: UserLocation) {
    manualLocation.value = next;
    error.value = null;
  }

  function clearManualLocation() {
    manualLocation.value = null;
  }

  function request() {
    clearManualLocation();

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      status.value = 'unavailable';
      error.value = 'Geolocation is not supported in this browser.';
      return;
    }

    status.value = 'pending';
    error.value = null;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        geoLocation.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracyM: position.coords.accuracy,
          source: 'geolocation',
          label: 'Your device location',
        };
        status.value = 'granted';
      },
      (err) => {
        geoLocation.value = null;
        status.value = err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable';
        error.value =
          err.code === err.PERMISSION_DENIED
            ? 'Location permission was denied.'
            : 'Could not determine your location.';
      },
      {
        enableHighAccuracy: false,
        timeout: 12_000,
        maximumAge: 300_000,
      }
    );
  }

  if (requestOnMount) {
    onMounted(request);
  }

  return {
    location,
    status,
    error,
    request,
    setManualLocation,
    clearManualLocation,
  };
}
