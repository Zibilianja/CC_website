import { fetchJson } from '../apiClient';
import type { GroundLayerData } from '../../types/spaceWeather';
import { parseNoaaScales } from './noaaParsers';
import { fetchGlobalWeatherEvents } from './globalWeatherEvents';
import { fetchWildfireEvents } from './wildfires';

export async function fetchGroundLayer(): Promise<GroundLayerData> {
  const [scalesRaw, wildfires, weatherEvents] = await Promise.all([
    fetchJson<unknown>(
      'https://services.swpc.noaa.gov/products/noaa-scales.json',
      { ttlMs: 15 * 60 * 1000 }
    ),
    fetchWildfireEvents().catch(() => ({
      fires: [],
      regionCount: 0,
      cappedRegions: [],
    })),
    fetchGlobalWeatherEvents().catch(() => []),
  ]);

  return {
    impactScales: parseNoaaScales(scalesRaw),
    weatherEvents,
    wildfires: wildfires.fires,
    wildfireRegionCount: wildfires.regionCount,
    wildfireCappedRegions: wildfires.cappedRegions,
  };
}
