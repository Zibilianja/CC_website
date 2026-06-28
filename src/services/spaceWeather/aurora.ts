import { fetchJson } from '../apiClient';
import type { AuroraLayerData, AuroraPoint } from '../../types/spaceWeather';
import { normalizeLongitude } from '../../utils/geo';
import {
  ACTIVITY_MIN_LATITUDE,
  computeViewingWeight,
  VIEWING_MIN_LATITUDE,
} from '../../utils/auroraViewing';

interface OvationResponse {
  'Observation Time'?: string;
  'Forecast Time'?: string;
  coordinates?: [number, number, number][];
}

function deriveViewlines(points: AuroraPoint[], maxIntensity: number): {
  viewlineNorth: string[];
  viewlineSouth: string[];
} {
  const northActive = points.filter(
    (p) =>
      p.latitude > 0 &&
      computeViewingWeight(p.latitude, p.intensity, maxIntensity) >= 0.1
  );
  const southActive = points.filter(
    (p) =>
      p.latitude < 0 &&
      computeViewingWeight(p.latitude, p.intensity, maxIntensity) >= 0.1
  );

  const viewlineNorth: string[] = [];
  const viewlineSouth: string[] = [];

  if (northActive.length) {
    const minLat = Math.min(...northActive.map((p) => p.latitude));
    viewlineNorth.push(`Aurora likely poleward of ~${minLat.toFixed(0)}°N`);
    viewlineNorth.push(
      `${northActive.length.toLocaleString()} viewing cells (north)`
    );
  } else {
    viewlineNorth.push('No significant viewing opportunity in the north');
  }

  if (southActive.length) {
    const maxLat = Math.max(...southActive.map((p) => p.latitude));
    viewlineSouth.push(
      `Aurora likely poleward of ~${Math.abs(maxLat).toFixed(0)}°S`
    );
    viewlineSouth.push(
      `${southActive.length.toLocaleString()} viewing cells (south)`
    );
  } else {
    viewlineSouth.push('No significant viewing opportunity in the south');
  }

  return { viewlineNorth, viewlineSouth };
}

export async function fetchAuroraLayer(): Promise<AuroraLayerData> {
  const ovation = await fetchJson<OvationResponse>(
    'https://services.swpc.noaa.gov/json/ovation_aurora_latest.json',
    { ttlMs: 30 * 60 * 1000 }
  );

  const allPoints: AuroraPoint[] = (ovation.coordinates ?? []).map(
    ([longitude, latitude, intensity]) => ({
      longitude: normalizeLongitude(longitude),
      latitude,
      intensity,
    })
  );

  const maxIntensity =
    allPoints.reduce((max, p) => Math.max(max, p.intensity), 0) || 1;

  const ovationPoints = allPoints.filter((p) => p.intensity > 0);
  const activityPoints = ovationPoints.filter(
    (p) => Math.abs(p.latitude) >= ACTIVITY_MIN_LATITUDE
  );

  const viewingCells = ovationPoints.filter(
    (p) => computeViewingWeight(p.latitude, p.intensity, maxIntensity) > 0
  );
  const highLatitudeCount = viewingCells.filter(
    (p) => Math.abs(p.latitude) >= VIEWING_MIN_LATITUDE
  ).length;

  const { viewlineNorth, viewlineSouth } = deriveViewlines(
    viewingCells,
    maxIntensity
  );

  if (ovation['Observation Time']) {
    viewlineNorth.unshift(`Observation: ${ovation['Observation Time']}`);
  }
  if (ovation['Forecast Time']) {
    viewlineSouth.unshift(`Forecast: ${ovation['Forecast Time']}`);
  }

  return {
    activityPoints,
    ovationPoints,
    highLatitudeCount,
    maxIntensity,
    viewlineNorth,
    viewlineSouth,
  };
}
