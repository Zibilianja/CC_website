import type { WeatherEventType } from '../types/spaceWeather';
import type { EonetEventRaw } from './eonet';

/** EONET categories fetched for the global weather events map (last 14 days). */
export const WEATHER_EONET_CATEGORIES = [
  'wildfires',
  'severeStorms',
  'floods',
  'snow',
  'landslides',
  'drought',
  'tempExtremes',
  'dustHaze',
] as const;

export const WEATHER_EVENT_DAYS = 14;

export interface WeatherEventFilter {
  id: WeatherEventType;
  label: string;
  color: string;
}

export const WEATHER_EVENT_FILTERS: WeatherEventFilter[] = [
  { id: 'wildfires', label: 'Wildfires', color: '#f97316' },
  { id: 'hurricanes', label: 'Hurricanes & tropical storms', color: '#6366f1' },
  { id: 'tornadoes', label: 'Tornadoes', color: '#a855f7' },
  { id: 'hail', label: 'Hail', color: '#22d3ee' },
  { id: 'severeThunderstorms', label: 'Severe thunderstorms', color: '#eab308' },
  { id: 'floods', label: 'Floods', color: '#3b82f6' },
  { id: 'snow', label: 'Snow & ice', color: '#cbd5e1' },
  { id: 'landslides', label: 'Landslides', color: '#84cc16' },
  { id: 'drought', label: 'Drought', color: '#d97706' },
  { id: 'tempExtremes', label: 'Extreme heat / cold', color: '#ef4444' },
  { id: 'dustHaze', label: 'Dust & haze', color: '#a8a29e' },
  { id: 'other', label: 'Other weather', color: '#6b7280' },
];

const FILTER_COLOR_BY_TYPE = Object.fromEntries(
  WEATHER_EVENT_FILTERS.map((f) => [f.id, f.color])
) as Record<WeatherEventType, string>;

export function weatherEventColor(eventType: WeatherEventType): string {
  return FILTER_COLOR_BY_TYPE[eventType] ?? '#6b7280';
}

function stormSubtype(title: string, description: string): WeatherEventType {
  const text = `${title} ${description}`.toLowerCase();

  if (/hurricane|typhoon|cyclone|tropical storm|tropical depression/.test(text)) {
    return 'hurricanes';
  }
  if (/tornado/.test(text)) {
    return 'tornadoes';
  }
  if (/hail/.test(text)) {
    return 'hail';
  }
  if (/thunder|lightning|severe storm|supercell|squall|wind storm|downburst|derecho/.test(text)) {
    return 'severeThunderstorms';
  }

  return 'severeThunderstorms';
}

export function inferWeatherEventType(event: EonetEventRaw): WeatherEventType {
  const categoryId = event.categories?.[0]?.id ?? '';
  const title = event.title ?? '';
  const description = event.description ?? '';

  switch (categoryId) {
    case 'wildfires':
      return 'wildfires';
    case 'floods':
      return 'floods';
    case 'snow':
    case 'seaLakeIce':
      return 'snow';
    case 'landslides':
      return 'landslides';
    case 'drought':
      return 'drought';
    case 'tempExtremes':
      return 'tempExtremes';
    case 'dustHaze':
      return 'dustHaze';
    case 'severeStorms':
      return stormSubtype(title, description);
    default:
      return 'other';
  }
}

export function defaultWeatherTypeChecked(): Record<WeatherEventType, boolean> {
  return Object.fromEntries(
    WEATHER_EVENT_FILTERS.map((f) => [f.id, true])
  ) as Record<WeatherEventType, boolean>;
}
