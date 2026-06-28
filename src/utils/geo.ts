/**
 * WGS84 lat/lon → unit vector on THREE.SphereGeometry (Y-up).
 * Same convention as Leaflet [lat, lon] on the flat map.
 */
export function latLonToUnitVector(lat: number, lon: number): [number, number, number] {
  const lonRad = (normalizeLongitude(lon) * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const cosLat = Math.cos(latRad);

  return [cosLat * Math.sin(lonRad), Math.sin(latRad), cosLat * Math.cos(lonRad)];
}

/** Normalize any longitude to −180…180 (OVATION uses 0…360). */
export function normalizeLongitude(lon: number): number {
  let n = lon % 360;
  if (n > 180) n -= 360;
  if (n < -180) n += 360;
  return n;
}

const EARTH_RADIUS_KM = 6371;

/** Great-circle distance in kilometers. */
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(normalizeLongitude(lon2) - normalizeLongitude(lon1));
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

export function formatDistanceKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 100) return `${Math.round(km)} km`;
  return `${Math.round(km).toLocaleString()} km`;
}

export function nearestGridIntensity(
  points: { longitude: number; latitude: number; intensity: number }[],
  lat: number,
  lon: number,
  radiusDeg = 3
): number {
  const targetLon = normalizeLongitude(lon);
  let best = 0;
  for (const point of points) {
    const dLat = point.latitude - lat;
    let dLon = normalizeLongitude(point.longitude) - targetLon;
    if (dLon > 180) dLon -= 360;
    if (dLon < -180) dLon += 360;
    const dist = Math.sqrt(dLat * dLat + dLon * dLon);
    if (dist <= radiusDeg) {
      best = Math.max(best, point.intensity);
    }
  }
  return best;
}

export function intensityToPercent(intensity: number, max = 10): number {
  return Math.min(100, Math.round((intensity / max) * 100));
}
