import { fetchJson } from '../apiClient';
import type { NaturalEvent } from '../../types/spaceWeather';
import { eonetEventPosition, type EonetEventRaw } from '../../utils/eonet';
import {
  inferWeatherEventType,
  WEATHER_EONET_CATEGORIES,
  WEATHER_EVENT_DAYS,
} from '../../utils/weatherEvents';

const EONET_LIMIT = 100;

function mapEonetEvent(event: EonetEventRaw): NaturalEvent {
  const position = eonetEventPosition(event.geometry);
  const categoryId = event.categories?.[0]?.id ?? '';
  const category = event.categories?.[0]?.title ?? 'Weather event';

  return {
    id: event.id,
    title: event.title,
    category,
    categoryId,
    eventType: inferWeatherEventType(event),
    date: position?.date ?? '—',
    latitude: position?.latitude ?? null,
    longitude: position?.longitude ?? null,
  };
}

async function fetchEonetWeatherEventsRaw(): Promise<EonetEventRaw[]> {
  const responses = await Promise.all(
    WEATHER_EONET_CATEGORIES.map((category) =>
      fetchJson<{ events: EonetEventRaw[] }>(
        `https://eonet.gsfc.nasa.gov/api/v3/events?category=${category}&days=${WEATHER_EVENT_DAYS}&status=all&limit=${EONET_LIMIT}`,
        { ttlMs: 30 * 60 * 1000 }
      ).catch(() => ({ events: [] as EonetEventRaw[] }))
    )
  );

  const byId = new Map<string, EonetEventRaw>();
  for (const response of responses) {
    for (const event of response.events ?? []) {
      if (!byId.has(event.id)) byId.set(event.id, event);
    }
  }

  return [...byId.values()];
}

/** NASA EONET damaging weather events for the global map (last 14 days). */
export async function fetchGlobalWeatherEvents(): Promise<NaturalEvent[]> {
  const raw = await fetchEonetWeatherEventsRaw();
  return raw.map(mapEonetEvent);
}
