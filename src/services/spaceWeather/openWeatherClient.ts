import { fetchJson } from '../apiClient';

export type OpenWeatherEndpoint = 'weather' | 'air_pollution' | 'forecast' | 'uvi';

export function openWeatherUrl(
  endpoint: OpenWeatherEndpoint,
  params: Record<string, string>
): string {
  const proxyBase = (
    import.meta.env.VITE_OPENWEATHER_PROXY_URL as string | undefined
  )?.trim();

  const query = new URLSearchParams(params).toString();

  if (proxyBase) {
    return `${proxyBase.replace(/\/$/, '')}/${endpoint}?${query}`;
  }

  return `/api/openweather/${endpoint}?${query}`;
}

export function openWeatherPointParams(lat: number, lon: number): Record<string, string> {
  return { lat: String(lat), lon: String(lon) };
}

export async function fetchOpenWeatherJson<T>(
  endpoint: OpenWeatherEndpoint,
  params: Record<string, string>,
  ttlMs = 15 * 60 * 1000
): Promise<T> {
  return fetchJson<T>(openWeatherUrl(endpoint, params), { ttlMs });
}

const AQI_LABELS: Record<number, string> = {
  1: 'Good',
  2: 'Fair',
  3: 'Moderate',
  4: 'Poor',
  5: 'Very poor',
};

export function aqiLabel(aqi: number | null | undefined): string | null {
  if (aqi == null || aqi < 1 || aqi > 5) return null;
  return AQI_LABELS[aqi] ?? null;
}

export function uvRiskLabel(uvi: number | null | undefined): string {
  if (uvi == null) return '—';
  if (uvi < 3) return 'Low';
  if (uvi < 6) return 'Moderate';
  if (uvi < 8) return 'High';
  if (uvi < 11) return 'Very high';
  return 'Extreme';
}
