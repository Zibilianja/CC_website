import type { KpReading, NoaaScaleEntry } from '../../types/spaceWeather';

interface KpObjectRow {
  time_tag?: string;
  Kp?: number;
  kp?: number;
}

interface NoaaScaleRow {
  Date?: string;
  date?: string;
  DateStamp?: string;
  R?: { Text?: string | null };
  S?: { Text?: string | null };
  G?: { Text?: string | null };
}

export function parseKpIndex(raw: unknown): KpReading[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];

  const first = raw[0];
  if (typeof first === 'object' && first !== null && !Array.isArray(first)) {
    return (raw as KpObjectRow[])
      .slice(-24)
      .map((row) => ({
        time: row.time_tag ?? '',
        kp: Number(row.Kp ?? row.kp) || 0,
      }))
      .filter((row) => row.time);
  }

  const [header, ...data] = raw as string[][];
  if (!Array.isArray(header)) return [];

  const timeIdx = header.indexOf('time_tag');
  const kpIdx = header.findIndex((col) => col.toLowerCase().includes('kp'));

  return data
    .slice(-24)
    .map((row) => ({
      time: row[timeIdx] ?? '',
      kp: Number(row[kpIdx]) || 0,
    }))
    .filter((row) => row.time);
}

export function parseNoaaScales(raw: unknown): NoaaScaleEntry[] {
  if (!raw) return [];

  const rows: NoaaScaleRow[] = Array.isArray(raw)
    ? raw
    : Object.values(raw as Record<string, NoaaScaleRow>);

  return rows
    .sort((a, b) =>
      (a.DateStamp ?? a.Date ?? '').localeCompare(b.DateStamp ?? b.Date ?? '')
    )
    .slice(0, 3)
    .map((row) => ({
      date: row.DateStamp ?? row.Date ?? row.date ?? '',
      radioBlackout: row.R?.Text || 'none',
      solarRadiation: row.S?.Text || 'none',
      geomagnetic: row.G?.Text || 'none',
    }));
}

export function parseTabularRows(raw: unknown): string[][] {
  if (!Array.isArray(raw)) return [];
  return raw as string[][];
}
