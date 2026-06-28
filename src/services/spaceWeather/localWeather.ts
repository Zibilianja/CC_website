import { fetchJson } from '../apiClient';
import type { OpenWeatherSnapshot, WeatherAlert } from '../../types/spaceWeather';
import { isLocationInUnitedStates } from '../../utils/localeUnits';
import { mapNoaaAlert, type NoaaAlertFeature } from '../../utils/weatherAlerts';
import {
  aqiLabel,
  fetchOpenWeatherJson,
  openWeatherPointParams,
} from './openWeatherClient';

interface OpenWeatherResponse {
  name?: string;
  main?: { temp?: number; humidity?: number };
  weather?: { description?: string }[];
  wind?: { speed?: number; deg?: number };
}

interface AirPollutionResponse {
  list?: { main?: { aqi?: number } }[];
}

interface ForecastResponse {
  list?: { pop?: number }[];
}

export interface LocalWeatherResult {
  weather: OpenWeatherSnapshot | null;
  alerts: WeatherAlert[];
  error: string | null;
}

function weatherGovUrl(path: string): string {
  return import.meta.env.DEV
    ? `/api/weather-gov${path}`
    : `https://api.weather.gov${path}`;
}

function mapAlert(feature: NoaaAlertFeature): WeatherAlert {
  return mapNoaaAlert(feature);
}

async function fetchOpenWeather(
  lat: number,
  lon: number
): Promise<OpenWeatherSnapshot | null> {
  const params = openWeatherPointParams(lat, lon);

  const [current, airPollution, forecast, uvi] = await Promise.all([
    fetchOpenWeatherJson<OpenWeatherResponse>('weather', params),
    fetchOpenWeatherJson<AirPollutionResponse>('air_pollution', params).catch(
      () => null
    ),
    fetchOpenWeatherJson<ForecastResponse>('forecast', params).catch(() => null),
    fetchOpenWeatherJson<number>('uvi', params).catch(() => null),
  ]);

  if (!current?.main) return null;

  const aqi = airPollution?.list?.[0]?.main?.aqi ?? null;
  const pop = forecast?.list?.[0]?.pop;
  const uvIndex = typeof uvi === 'number' && Number.isFinite(uvi) ? uvi : null;

  return {
    location: current.name ?? 'Your area',
    tempC: Math.round(current.main.temp ?? 0),
    humidity: current.main.humidity ?? 0,
    description: current.weather?.[0]?.description ?? '—',
    windSpeed: current.wind?.speed ?? 0,
    windDeg: current.wind?.deg ?? 0,
    airQualityIndex: aqi,
    airQualityLabel: aqiLabel(aqi),
    uvIndex,
    precipChance: pop != null ? Math.round(pop * 100) : null,
  };
}

async function fetchAlertsForPoint(lat: number, lon: number): Promise<WeatherAlert[]> {
  const response = await fetchJson<{ features: NoaaAlertFeature[] }>(
    weatherGovUrl(`/alerts/active?point=${lat},${lon}`),
    { ttlMs: 10 * 60 * 1000 }
  );

  return (response.features ?? []).slice(0, 8).map(mapAlert);
}

export async function fetchLocalWeather(
  lat: number,
  lon: number
): Promise<LocalWeatherResult> {
  let weather: OpenWeatherSnapshot | null = null;
  let alerts: WeatherAlert[] = [];
  let error: string | null = null;

  const weatherPromise = fetchOpenWeather(lat, lon).catch((err: unknown) => {
    error = err instanceof Error ? err.message : 'Weather request failed';
    return null;
  });

  const alertsPromise = isLocationInUnitedStates(lat, lon)
    ? fetchAlertsForPoint(lat, lon).catch(() => [] as WeatherAlert[])
    : Promise.resolve([] as WeatherAlert[]);

  [weather, alerts] = await Promise.all([weatherPromise, alertsPromise]);

  return { weather, alerts, error };
}
