import { fetchJson } from '../apiClient';
import type { AlertGeometry, WeatherAlert } from '../../types/spaceWeather';
import {
  formatAlertRegion,
  inferStateAbbr,
  primaryAreaLabel,
} from '../../utils/alertGeography';

interface ZoneResponse {
  geometry?: AlertGeometry | null;
}

interface GeocodeResult {
  results?: { latitude: number; longitude: number; name: string }[];
}

const zoneCache = new Map<string, AlertGeometry>();
const geocodeCache = new Map<string, { latitude: number; longitude: number }>();

function weatherGovUrl(path: string): string {
  return import.meta.env.DEV
    ? `/api/weather-gov${path}`
    : `https://api.weather.gov${path}`;
}

function zoneCacheKey(zoneId: string, kind: 'forecast' | 'county'): string {
  return `${kind}:${zoneId}`;
}

async function fetchSingleZoneGeometry(
  zoneId: string,
  kind: 'forecast' | 'county'
): Promise<AlertGeometry | null> {
  const key = zoneCacheKey(zoneId, kind);
  const cached = zoneCache.get(key);
  if (cached) return cached;

  const path =
    kind === 'county'
      ? `/zones/county/${zoneId}`
      : `/zones/forecast/${zoneId}`;

  try {
    const response = await fetchJson<ZoneResponse>(weatherGovUrl(path), {
      ttlMs: 24 * 60 * 60 * 1000,
    });
    if (!response.geometry) return null;

    const geometry: AlertGeometry = {
      type: response.geometry.type as AlertGeometry['type'],
      coordinates: response.geometry.coordinates,
    };
    zoneCache.set(key, geometry);
    return geometry;
  } catch {
    return null;
  }
}

async function fetchZoneGeometries(
  zoneIds: string[],
  kind: 'forecast' | 'county'
): Promise<AlertGeometry[]> {
  const unique = [...new Set(zoneIds.filter(Boolean))];
  const results = await Promise.all(
    unique.map((id) => fetchSingleZoneGeometry(id, kind))
  );
  return results.filter((g): g is AlertGeometry => g != null);
}

async function fetchAlertZoneGeometries(alert: WeatherAlert): Promise<AlertGeometry[]> {
  if (alert.countyZoneIds.length > 0) {
    const county = await fetchZoneGeometries(alert.countyZoneIds, 'county');
    if (county.length > 0) return county;
  }

  if (alert.forecastZoneIds.length > 0) {
    return fetchZoneGeometries(alert.forecastZoneIds, 'forecast');
  }

  return [];
}

async function geocodeAreaFallback(
  alert: WeatherAlert
): Promise<{ latitude: number; longitude: number } | null> {
  const stateAbbr = inferStateAbbr(alert.area, alert.senderName);
  const primary = primaryAreaLabel(alert.area.replace(/\s*\([^)]+\)\s*$/, ''));
  const cacheKey = `${primary}|${stateAbbr ?? ''}`;
  const cached = geocodeCache.get(cacheKey);
  if (cached) return cached;

  const stateName = stateAbbr
    ? formatAlertRegion(stateAbbr).split(',')[0]
    : '';

  const queries = [
    stateName ? `${primary}, ${stateName}` : primary,
    primary,
    alert.senderName?.replace(/^NWS\s+/i, '').replace(/\s+[A-Z]{2}$/, '') ?? '',
  ].filter(Boolean);

  for (const query of queries) {
    if (!query.trim()) continue;

    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json&countryCode=US`;
      const response = await fetchJson<GeocodeResult>(url, {
        ttlMs: 7 * 24 * 60 * 60 * 1000,
      });
      const hit = response.results?.[0];
      if (hit) {
        const point = { latitude: hit.latitude, longitude: hit.longitude };
        geocodeCache.set(cacheKey, point);
        return point;
      }
    } catch {
      // try next query
    }
  }

  return null;
}

export type AlertMapSource = 'zones' | 'geometry' | 'geocode' | 'none';

export interface ResolvedAlertMap {
  geometries: AlertGeometry[];
  point: { latitude: number; longitude: number } | null;
  source: AlertMapSource;
  caption: string;
}

export async function resolveAlertMap(alert: WeatherAlert): Promise<ResolvedAlertMap> {
  const region = alert.region || formatAlertRegion(inferStateAbbr(alert.area, alert.senderName));

  const zoneGeometries = await fetchAlertZoneGeometries(alert);
  if (zoneGeometries.length > 0) {
    return {
      geometries: zoneGeometries,
      point: null,
      source: 'zones',
      caption: `${region} · ${alert.area}`,
    };
  }

  if (alert.geometry) {
    return {
      geometries: [alert.geometry],
      point: null,
      source: 'geometry',
      caption: `${region} · ${alert.area}`,
    };
  }

  const hasZoneIds =
    alert.countyZoneIds.length > 0 || alert.forecastZoneIds.length > 0;
  if (!hasZoneIds) {
    const point = await geocodeAreaFallback(alert);
    if (point) {
      const primary = primaryAreaLabel(alert.area);
      return {
        geometries: [],
        point,
        source: 'geocode',
        caption: `${region} · approximate location: ${primary}`,
      };
    }
  }

  return {
    geometries: [],
    point: null,
    source: 'none',
    caption: `${region} · ${alert.area} (area could not be mapped)`,
  };
}
