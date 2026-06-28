import type { EarthquakeFeature } from '../types/spaceWeather';
import { haversineDistanceKm } from './geo';

const EARTH_RADIUS_KM = 6371;

export const NEARBY_EARTHQUAKE_RADIUS_KM = 500;

export type MagnitudeBandId = 'm25_4' | 'm4_6' | 'm6plus';

export const MAGNITUDE_BANDS: readonly {
  id: MagnitudeBandId;
  label: string;
  color: string;
  matches: (magnitude: number) => boolean;
}[] = [
  {
    id: 'm25_4',
    label: 'M2.5–4',
    color: '#00e5ff',
    matches: (m) => m < 4,
  },
  {
    id: 'm4_6',
    label: 'M4–6',
    color: '#39ff14',
    matches: (m) => m >= 4 && m <= 6,
  },
  {
    id: 'm6plus',
    label: 'M6+',
    color: '#ff1744',
    matches: (m) => m > 6,
  },
] as const;

export function magnitudeBandId(magnitude: number): MagnitudeBandId {
  if (magnitude > 6) return 'm6plus';
  if (magnitude >= 4) return 'm4_6';
  return 'm25_4';
}

/** When no bands are selected, all M2.5+ events are shown. */
export function filterByMagnitudeBands(
  earthquakes: EarthquakeFeature[],
  selectedBandIds: MagnitudeBandId[]
): EarthquakeFeature[] {
  const visible = visibleEarthquakes(earthquakes);
  if (selectedBandIds.length === 0) return visible;
  const selected = new Set(selectedBandIds);
  return visible.filter((q) => selected.has(magnitudeBandId(q.magnitude)));
}

/** Neon epicenter colors by magnitude band. */
export function magnitudeColor(magnitude: number): string {
  return MAGNITUDE_BANDS.find((b) => b.matches(magnitude))?.color ?? '#00e5ff';
}

/** Draw order tier: blue 1, green 2, red 3 — higher draws on top. */
export function magnitudeRenderTier(magnitude: number): number {
  if (magnitude > 6) return 3;
  if (magnitude >= 4) return 2;
  return 1;
}

export function magnitudeRenderOrder(magnitude: number): number {
  return magnitudeRenderTier(magnitude) * 100 + Math.round(magnitude * 10);
}

/** Smooth depth color: shallow red → orange → amber → teal → sky → deep blue. */
export function depthColorSmooth(depthKm: number, maxDepthKm = 400): string {
  const stops = [
    { p: 0, r: 239, g: 68, b: 68 },
    { p: 0.18, r: 249, g: 115, b: 22 },
    { p: 0.38, r: 251, g: 191, b: 36 },
    { p: 0.58, r: 45, g: 212, b: 191 },
    { p: 0.78, r: 56, g: 189, b: 248 },
    { p: 1, r: 59, g: 130, b: 246 },
  ];
  const t = Math.min(1, Math.max(0, depthKm / maxDepthKm));

  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (t >= a.p && t <= b.p) {
      const local = (t - a.p) / (b.p - a.p);
      const r = Math.round(a.r + (b.r - a.r) * local);
      const g = Math.round(a.g + (b.g - a.g) * local);
      const bl = Math.round(a.b + (b.b - a.b) * local);
      return `rgb(${r}, ${g}, ${bl})`;
    }
  }

  const last = stops[stops.length - 1];
  return `rgb(${last.r}, ${last.g}, ${last.b})`;
}

/** M2.5+ events sorted for draw order (lowest magnitude first). */
export function visibleEarthquakes(
  earthquakes: EarthquakeFeature[],
  minMagnitude = 2.5
): EarthquakeFeature[] {
  return earthquakes
    .filter((q) => q.magnitude >= minMagnitude)
    .sort((a, b) => a.magnitude - b.magnitude);
}

export function earthquakeDistanceKm(
  quake: EarthquakeFeature,
  latitude: number,
  longitude: number
): number {
  return haversineDistanceKm(latitude, longitude, quake.latitude, quake.longitude);
}

export function earthquakesNearLocation(
  earthquakes: EarthquakeFeature[],
  latitude: number,
  longitude: number,
  radiusKm = NEARBY_EARTHQUAKE_RADIUS_KM
): EarthquakeFeature[] {
  return visibleEarthquakes(earthquakes).filter(
    (q) => earthquakeDistanceKm(q, latitude, longitude) <= radiusKm
  );
}

export function sortEarthquakesByDistance(
  earthquakes: EarthquakeFeature[],
  latitude: number,
  longitude: number
): EarthquakeFeature[] {
  return [...earthquakes].sort(
    (a, b) =>
      earthquakeDistanceKm(a, latitude, longitude) -
      earthquakeDistanceKm(b, latitude, longitude)
  );
}

/**
 * Rough felt / perceptible shaking radius from magnitude (visual estimate, not USGS official).
 */
export function magnitudeToFeltRadiusKm(magnitude: number): number {
  const km = 22 * Math.pow(2, magnitude - 2.5);
  return Math.min(Math.max(km, 12), 900);
}

/** Convert ground distance to tangent-plane radius on a unit globe. */
export function feltRadiusToGlobeUnits(km: number): number {
  const angularRad = km / EARTH_RADIUS_KM;
  return Math.tan(angularRad);
}
