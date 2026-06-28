export interface EonetGeometryEntry {
  date?: string;
  type?: string;
  coordinates?: unknown;
}

export interface EonetEventRaw {
  id: string;
  title: string;
  description?: string | null;
  categories?: { id?: string; title?: string }[];
  geometry?: EonetGeometryEntry[];
}

export function eonetEventPosition(
  geometry: EonetGeometryEntry[] | undefined
): { latitude: number; longitude: number; date: string } | null {
  if (!geometry?.length) return null;

  const latest = geometry[geometry.length - 1];
  const coords = latest.coordinates;

  if (latest.type === 'Point' && Array.isArray(coords) && coords.length >= 2) {
    return {
      longitude: coords[0] as number,
      latitude: coords[1] as number,
      date: latest.date ?? '—',
    };
  }

  if (latest.type === 'Polygon' && Array.isArray(coords)) {
    const ring = coords[0] as number[][] | undefined;
    const point = ring?.[0];
    if (point && point.length >= 2) {
      return {
        longitude: point[0],
        latitude: point[1],
        date: latest.date ?? '—',
      };
    }
  }

  if (latest.type === 'MultiPolygon' && Array.isArray(coords)) {
    const polygon = coords[0] as number[][][] | undefined;
    const point = polygon?.[0]?.[0];
    if (point && point.length >= 2) {
      return {
        longitude: point[0],
        latitude: point[1],
        date: latest.date ?? '—',
      };
    }
  }

  return null;
}

/** Latest geometry entry suitable for map overlays. */
export function eonetLatestGeometry(
  geometry: EonetGeometryEntry[] | undefined
): {
  type: 'Point' | 'Polygon' | 'MultiPolygon';
  coordinates: unknown;
  date: string;
} | null {
  if (!geometry?.length) return null;

  const latest = geometry[geometry.length - 1];
  if (!latest.type || latest.coordinates == null) return null;

  if (
    latest.type === 'Point' ||
    latest.type === 'Polygon' ||
    latest.type === 'MultiPolygon'
  ) {
    return {
      type: latest.type,
      coordinates: latest.coordinates,
      date: latest.date ?? '—',
    };
  }

  return null;
}

export const EONET_WILDFIRES_CATEGORY = 'wildfires';

/** @deprecated Use WEATHER_EONET_CATEGORIES from weatherEvents.ts */
export const EONET_WEATHER_CATEGORIES = [
  'severeStorms',
  'floods',
  EONET_WILDFIRES_CATEGORY,
  'dustHaze',
] as const;