import { fetchJson } from '../apiClient';
import type { UserLocation } from '../../composables/useUserLocation';
import { openWeatherUrl } from './openWeatherClient';
interface OpenWeatherZipResponse {
  name?: string;
  coord?: { lat: number; lon: number };
  main?: { temp?: number };
}

interface GeocodeResult {
  results?: {
    latitude: number;
    longitude: number;
    name: string;
    admin1?: string;
    country_code?: string;
  }[];
}

function openWeatherZipUrl(zip: string): string {
  return openWeatherUrl('weather', { zip: `${zip},US` });
}

async function resolveZip(zip: string): Promise<UserLocation> {
  const response = await fetchJson<OpenWeatherZipResponse>(
    openWeatherZipUrl(zip),
    { ttlMs: 24 * 60 * 60 * 1000 }
  );
  if (!response.coord) {
    throw new Error(`Could not find weather for ZIP ${zip}.`);
  }

  return {
    latitude: response.coord.lat,
    longitude: response.coord.lon,
    label: response.name ? `${response.name} (${zip})` : `ZIP ${zip}`,
    zipCode: zip,
    source: 'zip',
  };
}

async function resolveCity(query: string): Promise<UserLocation> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
  const response = await fetchJson<GeocodeResult>(url, {
    ttlMs: 7 * 24 * 60 * 60 * 1000,
  });

  const hit =
    response.results?.find((r) => r.country_code === 'US') ?? response.results?.[0];

  if (!hit) {
    throw new Error(`Could not find "${query}". Try "City, ST" or a ZIP code.`);
  }

  const label = hit.admin1 ? `${hit.name}, ${hit.admin1}` : hit.name;

  return {
    latitude: hit.latitude,
    longitude: hit.longitude,
    label,
    source: 'city',
  };
}

export async function resolveLocationSearch(query: string): Promise<UserLocation> {
  const trimmed = query.trim();
  if (!trimmed) {
    throw new Error('Enter a ZIP code or city name.');
  }

  if (/^\d{5}(-\d{4})?$/.test(trimmed)) {
    return resolveZip(trimmed.slice(0, 5));
  }

  return resolveCity(trimmed);
}
