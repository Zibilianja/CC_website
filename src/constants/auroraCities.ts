export interface AuroraCity {
  name: string;
  lat: number;
  lon: number;
  timezone: string;
}

export const AURORA_CITIES: AuroraCity[] = [
  { name: 'Reykjavik', lat: 64.1466, lon: -21.9426, timezone: 'Atlantic/Reykjavik' },
  { name: 'Tromsø', lat: 69.6492, lon: 18.9553, timezone: 'Europe/Oslo' },
  { name: 'Fairbanks', lat: 64.8378, lon: -147.7164, timezone: 'America/Anchorage' },
  { name: 'Yellowknife', lat: 62.454, lon: -114.3718, timezone: 'America/Edmonton' },
  { name: 'Abisko', lat: 68.3498, lon: 18.8312, timezone: 'Europe/Stockholm' },
  { name: 'Edinburgh', lat: 55.9533, lon: -3.1883, timezone: 'Europe/London' },
];
