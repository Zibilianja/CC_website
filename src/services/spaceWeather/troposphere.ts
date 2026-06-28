import { fetchJson } from '../apiClient';
import type {
  OpenWeatherSnapshot,
  TroposphereLayerData,
  WeatherAlert,
} from '../../types/spaceWeather';
import { mapNoaaAlert } from '../../utils/weatherAlerts';

interface OpenWeatherResponse {
  name?: string;
  main?: { temp?: number; humidity?: number };
  weather?: { description?: string }[];
  wind?: { speed?: number; deg?: number };
}

const DEFAULT_LAT = 39.7392;
const DEFAULT_LON = -104.9903;

function openWeatherUrl(): string {
  const proxyBase = (
    import.meta.env.VITE_OPENWEATHER_PROXY_URL as string | undefined
  )?.trim();
  const query = `lat=${DEFAULT_LAT}&lon=${DEFAULT_LON}`;

  if (proxyBase) {
    return `${proxyBase.replace(/\/$/, '')}/weather?${query}`;
  }

  return `/api/openweather/weather?${query}`;
}

export async function fetchTroposphereLayer(): Promise<TroposphereLayerData> {
  const openWeatherPath = openWeatherUrl();

  const alertsUrl = import.meta.env.DEV
    ? '/api/weather-gov/alerts/active'
    : 'https://api.weather.gov/alerts/active';

  let openWeatherError: string | null = null;

  const [alertsRaw, openWeather] = await Promise.all([
    fetchJson<{ features: Parameters<typeof mapNoaaAlert>[0][] }>(alertsUrl, {
      ttlMs: 10 * 60 * 1000,
    }),
    fetchJson<OpenWeatherResponse>(openWeatherPath, {
      ttlMs: 30 * 60 * 1000,
    }).catch((err: unknown) => {
      openWeatherError =
        err instanceof Error ? err.message : 'OpenWeather request failed';
      return null;
    }),
  ]);

  const alerts: WeatherAlert[] = (alertsRaw.features ?? [])
    .slice(0, 30)
    .map(mapNoaaAlert);

  let snapshot: OpenWeatherSnapshot | null = null;
  if (openWeather?.main) {
    snapshot = {
      location: openWeather.name ?? 'Denver',
      tempC: Math.round(openWeather.main.temp ?? 0),
      humidity: openWeather.main.humidity ?? 0,
      description: openWeather.weather?.[0]?.description ?? '—',
      windSpeed: openWeather.wind?.speed ?? 0,
      windDeg: openWeather.wind?.deg ?? 0,
      airQualityIndex: null,
      airQualityLabel: null,
      uvIndex: null,
      precipChance: null,
    };
  }

  return {
    alerts,
    openWeather: snapshot,
    openWeatherConfigured: true,
    openWeatherError,
  };
}
