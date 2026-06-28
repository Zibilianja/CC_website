import { fetchJson } from '../apiClient';
import type { WildfireEvent } from '../../types/spaceWeather';
import {
  eonetEventPosition,
  eonetLatestGeometry,
  type EonetEventRaw,
} from '../../utils/eonet';

/** EONET caps each request; there is no offset/page parameter. */
const EONET_PAGE_SIZE = 100;

/**
 * Regional bounding boxes (minLon, maxLat, maxLon, minLat) so we are not limited
 * to the 100 most recent fires worldwide.
 */
const WILDFIRE_REGIONS: { id: string; bbox: string }[] = [
  { id: 'southern-rockies', bbox: '-109,41,-102,37' },
  { id: 'northern-rockies', bbox: '-125,49,-104,37' },
  { id: 'southwest', bbox: '-125,37,-102,31' },
  { id: 'central-us', bbox: '-104,49,-88,25' },
  { id: 'eastern-us', bbox: '-88,49,-66,24' },
  { id: 'alaska', bbox: '-170,72,-129,51' },
  { id: 'hawaii', bbox: '-161,23,-154,18' },
  { id: 'canada', bbox: '-141,72,-52,41' },
  { id: 'mexico-central-america', bbox: '-118,32,-77,7' },
  { id: 'south-america', bbox: '-82,13,-34,-56' },
  { id: 'eurasia-africa', bbox: '-30,72,60,-35' },
  { id: 'asia-pacific', bbox: '60,72,180,-50' },
  { id: 'pacific-south', bbox: '-180,72,-30,-50' },
];

export interface WildfireFetchResult {
  fires: WildfireEvent[];
  regionCount: number;
  /** Region IDs that returned exactly 100 events (likely truncated). */
  cappedRegions: string[];
}

function mapWildfireEvent(event: EonetEventRaw): WildfireEvent {
  const position = eonetEventPosition(event.geometry);
  const latestGeometry = eonetLatestGeometry(event.geometry);

  return {
    id: event.id,
    title: event.title,
    date: position?.date ?? latestGeometry?.date ?? '—',
    latitude: position?.latitude ?? null,
    longitude: position?.longitude ?? null,
    geometry: latestGeometry
      ? { type: latestGeometry.type, coordinates: latestGeometry.coordinates }
      : null,
  };
}

async function fetchWildfiresForBbox(bbox: string): Promise<EonetEventRaw[]> {
  const response = await fetchJson<{ events: EonetEventRaw[] }>(
    `https://eonet.gsfc.nasa.gov/api/v3/events?category=wildfires&status=open&limit=${EONET_PAGE_SIZE}&bbox=${bbox}`,
    { ttlMs: 30 * 60 * 1000 }
  );
  return response.events ?? [];
}

/** Open wildfire events from NASA EONET, merged across regional queries. */
export async function fetchWildfireEvents(): Promise<WildfireFetchResult> {
  const results = await Promise.all(
    WILDFIRE_REGIONS.map(async (region) => {
      const events = await fetchWildfiresForBbox(region.bbox).catch(() => [] as EonetEventRaw[]);
      return { region, events };
    })
  );

  const byId = new Map<string, WildfireEvent>();
  const cappedRegions: string[] = [];

  for (const { region, events } of results) {
    if (events.length >= EONET_PAGE_SIZE) {
      cappedRegions.push(region.id);
    }
    for (const event of events) {
      if (!byId.has(event.id)) {
        byId.set(event.id, mapWildfireEvent(event));
      }
    }
  }

  return {
    fires: [...byId.values()],
    regionCount: WILDFIRE_REGIONS.length,
    cappedRegions,
  };
}
