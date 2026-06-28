import type { EarthquakeTimeframe } from '../types/spaceWeather';

export interface EarthquakeTimeframeOption {
  id: EarthquakeTimeframe;
  label: string;
  shortLabel: string;
}

export const EARTHQUAKE_TIMEFRAMES: EarthquakeTimeframeOption[] = [
  { id: '1h', label: 'Past hour', shortLabel: '1 hour' },
  { id: '24h', label: 'Past 24 hours', shortLabel: '24 hours' },
  { id: '7d', label: 'Past 7 days', shortLabel: '7 days' },
  { id: '30d', label: 'Past 30 days', shortLabel: '30 days' },
];

export function timeframeShortLabel(id: EarthquakeTimeframe): string {
  return EARTHQUAKE_TIMEFRAMES.find((t) => t.id === id)?.shortLabel ?? id;
}
