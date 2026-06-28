import { normalizeLongitude } from './geo';
import type { UserLocation } from '../composables/useUserLocation';

export type UnitSystem = 'metric' | 'imperial';

const KM_PER_MILE = 1.60934;
const METERS_PER_FOOT = 0.3048;
const MPS_TO_MPH = 2.23694;

function inBox(
  lat: number,
  lon: number,
  minLat: number,
  maxLat: number,
  minLon: number,
  maxLon: number
): boolean {
  const lonN = normalizeLongitude(lon);
  return lat >= minLat && lat <= maxLat && lonN >= minLon && lonN <= maxLon;
}

/** Approximate US states and territories from coordinates. */
export function isLocationInUnitedStates(lat: number, lon: number): boolean {
  return (
    inBox(lat, lon, 24.4, 49.4, -125.0, -66.9) ||
    inBox(lat, lon, 51.0, 71.4, -179.0, -129.0) ||
    inBox(lat, lon, 18.5, 22.3, -160.8, -154.7) ||
    inBox(lat, lon, 17.8, 18.6, -67.3, -65.2) ||
    inBox(lat, lon, 13.0, 13.8, 144.5, 145.0) ||
    inBox(lat, lon, 17.6, 18.5, -65.1, -64.5)
  );
}

function inferUnitSystemFromBrowser(): UnitSystem {
  if (typeof navigator === 'undefined') return 'metric';
  const lang = navigator.language?.toLowerCase() ?? '';
  if (lang === 'en-us' || lang.endsWith('-us')) return 'imperial';
  return 'metric';
}

export function resolveUnitSystem(location: UserLocation | null): UnitSystem {
  if (location) {
    return isLocationInUnitedStates(location.latitude, location.longitude)
      ? 'imperial'
      : 'metric';
  }
  return inferUnitSystemFromBrowser();
}

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function kmToMiles(km: number): number {
  return km / KM_PER_MILE;
}

export function formatTemperature(celsius: number, system: UnitSystem): string {
  if (system === 'imperial') {
    return `${Math.round(celsiusToFahrenheit(celsius))}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatDistance(km: number, system: UnitSystem): string {
  if (system === 'imperial') {
    const miles = kmToMiles(km);
    if (miles < 0.1) {
      const feet = km * 1000 / METERS_PER_FOOT;
      return `${Math.round(feet)} ft`;
    }
    if (miles < 100) return `${Math.round(miles)} mi`;
    return `${Math.round(miles).toLocaleString()} mi`;
  }

  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 100) return `${Math.round(km)} km`;
  return `${Math.round(km).toLocaleString()} km`;
}

export function formatRadiusLabel(radiusKm: number, system: UnitSystem): string {
  if (system === 'imperial') {
    return `${Math.round(kmToMiles(radiusKm))} mi`;
  }
  return `${radiusKm} km`;
}

export function formatDepth(depthKm: number, system: UnitSystem): string {
  if (system === 'imperial') {
    const miles = kmToMiles(depthKm);
    if (miles >= 1) return `${miles.toFixed(1)} mi deep`;
    const feet = (depthKm * 1000) / METERS_PER_FOOT;
    return `${Math.round(feet)} ft deep`;
  }
  return `${depthKm.toFixed(0)} km deep`;
}

export function formatWindSpeed(metersPerSecond: number, system: UnitSystem): string {
  if (system === 'imperial') {
    return `${Math.round(metersPerSecond * MPS_TO_MPH)} mph`;
  }
  return `${Math.round(metersPerSecond)} m/s`;
}

const WIND_DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;

export function windDirectionLabel(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalized / 45) % 8;
  return WIND_DIRECTIONS[index];
}

export function formatWind(
  metersPerSecond: number,
  degrees: number,
  system: UnitSystem
): string {
  return `${formatWindSpeed(metersPerSecond, system)} ${windDirectionLabel(degrees)}`;
}
