import { fetchJson } from '../apiClient';
import type { CmeEvent, SolarFlareEvent, SolarLayerData, SolarWindReading, XRayReading } from '../../types/spaceWeather';
import { parseTabularRows } from './noaaParsers';

const NASA_KEY =
  (import.meta.env.VITE_NASA_API_KEY as string | undefined)?.trim() || 'DEMO_KEY';
const TTL = 15 * 60 * 1000;

function parseDonkiFlares(raw: DonkiFlare[]): SolarFlareEvent[] {
  return raw.slice(0, 8).map((item) => ({
    id: item.flrID,
    beginTime: item.beginTime,
    peakTime: item.peakTime ?? item.beginTime,
    classType: item.classType ?? 'Unknown',
    sourceLocation: item.sourceLocation ?? '—',
  }));
}

function parseDonkiCmes(raw: DonkiCme[]): CmeEvent[] {
  return raw.slice(0, 8).map((item) => ({
    id: item.activityID,
    startTime: item.startTime,
    activityId: item.activityID,
    note: item.note ?? 'Coronal mass ejection',
    type: item.cmeAnalyses?.[0]?.type ?? 'CME',
  }));
}

function parsePlasma(rows: string[][]): SolarWindReading[] {
  if (rows.length < 2) return [];
  const [header, ...data] = rows;
  const timeIdx = header.indexOf('time_tag');
  const speedIdx = header.indexOf('speed');
  const densityIdx = header.indexOf('density');

  return data
    .slice(-24)
    .map((row) => ({
      time: row[timeIdx] ?? '',
      speed: Number(row[speedIdx]) || 0,
      density: Number(row[densityIdx]) || 0,
      bt: 0,
    }))
    .filter((row) => row.time);
}

function attachMagneticField(
  readings: SolarWindReading[],
  magRows: string[][]
): SolarWindReading[] {
  if (magRows.length < 2 || !readings.length) return readings;

  const [header, ...data] = magRows;
  const timeIdx = header.indexOf('time_tag');
  const btIdx = header.indexOf('bt');
  const btByTime = new Map(
    data.map((row) => [row[timeIdx], Number(row[btIdx]) || 0])
  );

  return readings.map((reading) => ({
    ...reading,
    bt: btByTime.get(reading.time) ?? reading.bt,
  }));
}

function parseXray(raw: XRayRow[]): XRayReading[] {
  return raw.slice(-24).map((row) => ({
    time: row.time_tag,
    flux: Number(row.flux) || 0,
    satellite: Number(row.satellite) || 0,
  }));
}

interface DonkiFlare {
  flrID: string;
  beginTime: string;
  peakTime?: string;
  classType?: string;
  sourceLocation?: string;
}

interface DonkiCme {
  activityID: string;
  startTime: string;
  note?: string;
  cmeAnalyses?: { type?: string }[];
}

interface XRayRow {
  time_tag: string;
  flux: string | number;
  satellite: string | number;
}

export async function fetchSolarLayer(): Promise<SolarLayerData> {
  const start = new Date();
  start.setDate(start.getDate() - 14);
  const startDate = start.toISOString().split('T')[0];
  const endDate = new Date().toISOString().split('T')[0];

  const [flares, cmes, plasmaRows, magRows, xray] = await Promise.all([
    fetchJson<DonkiFlare[]>(
      `https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}&api_key=${NASA_KEY}`,
      { ttlMs: TTL }
    ),
    fetchJson<DonkiCme[]>(
      `https://api.nasa.gov/DONKI/CME?startDate=${startDate}&endDate=${endDate}&api_key=${NASA_KEY}`,
      { ttlMs: TTL }
    ),
    fetchJson<unknown>(
      'https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json',
      { ttlMs: 5 * 60 * 1000 }
    ),
    fetchJson<unknown>(
      'https://services.swpc.noaa.gov/products/solar-wind/mag-1-day.json',
      { ttlMs: 5 * 60 * 1000 }
    ),
    fetchJson<XRayRow[]>(
      'https://services.swpc.noaa.gov/json/goes/primary/xrays-6-hour.json',
      { ttlMs: 5 * 60 * 1000 }
    ),
  ]);

  const solarWind = attachMagneticField(
    parsePlasma(parseTabularRows(plasmaRows)),
    parseTabularRows(magRows)
  );
  const latestWind = solarWind.length ? solarWind[solarWind.length - 1] : undefined;

  return {
    flares: parseDonkiFlares(flares),
    cmes: parseDonkiCmes(cmes),
    solarWind,
    xray: parseXray(xray),
    latestWindSpeed: latestWind?.speed ?? null,
    latestXrayFlux: xray.length
      ? Number(xray[xray.length - 1]?.flux) || null
      : null,
  };
}
