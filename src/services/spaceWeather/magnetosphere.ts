import { fetchJson } from '../apiClient';
import type { MagnetosphereLayerData } from '../../types/spaceWeather';
import { parseKpIndex, parseNoaaScales } from './noaaParsers';

function stormLevelFromKp(kp: number): string {
  if (kp >= 9) return 'G5 — Extreme';
  if (kp >= 8) return 'G4 — Severe';
  if (kp >= 7) return 'G3 — Strong';
  if (kp >= 6) return 'G2 — Moderate';
  if (kp >= 5) return 'G1 — Minor';
  return 'Below storm threshold';
}

export async function fetchMagnetosphereLayer(): Promise<MagnetosphereLayerData> {
  const [kpRaw, scalesRaw] = await Promise.all([
    fetchJson<unknown>(
      'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json',
      { ttlMs: 5 * 60 * 1000 }
    ),
    fetchJson<unknown>(
      'https://services.swpc.noaa.gov/products/noaa-scales.json',
      { ttlMs: 15 * 60 * 1000 }
    ),
  ]);

  const kpSeries = parseKpIndex(kpRaw);
  const latestKp = kpSeries.length ? kpSeries[kpSeries.length - 1].kp : null;

  return {
    kpSeries,
    latestKp,
    stormLevel: latestKp != null ? stormLevelFromKp(latestKp) : 'Unknown',
    scales: parseNoaaScales(scalesRaw),
  };
}
