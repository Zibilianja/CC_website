import { fetchJson } from '../apiClient';
import type { EarthquakeFeature, SubsurfaceLayerData } from '../../types/spaceWeather';

interface UsgsGeoJson {
  features: {
    id: string;
    properties: {
      mag: number | null;
      place: string;
      time: number;
    };
    geometry: {
      coordinates: [number, number, number];
    };
  }[];
}

function parseEarthquakes(features: UsgsGeoJson['features']): EarthquakeFeature[] {
  return (features ?? []).map((feature) => ({
    id: feature.id,
    magnitude: feature.properties.mag ?? 0,
    place: feature.properties.place,
    time: new Date(feature.properties.time).toISOString(),
    depthKm: feature.geometry.coordinates[2],
    latitude: feature.geometry.coordinates[1],
    longitude: feature.geometry.coordinates[0],
  }));
}

export async function fetchSubsurfaceLayer(): Promise<SubsurfaceLayerData> {
  const [significant, hour, day, week, month] = await Promise.all([
    fetchJson<UsgsGeoJson>(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_day.geojson',
      { ttlMs: 5 * 60 * 1000 }
    ),
    fetchJson<UsgsGeoJson>(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson',
      { ttlMs: 5 * 60 * 1000 }
    ),
    fetchJson<UsgsGeoJson>(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',
      { ttlMs: 5 * 60 * 1000 }
    ),
    fetchJson<UsgsGeoJson>(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson',
      { ttlMs: 5 * 60 * 1000 }
    ),
    fetchJson<UsgsGeoJson>(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson',
      { ttlMs: 5 * 60 * 1000 }
    ),
  ]);

  return {
    earthquakes: parseEarthquakes(significant.features),
    earthquakesByTimeframe: {
      '1h': parseEarthquakes(hour.features),
      '24h': parseEarthquakes(day.features),
      '7d': parseEarthquakes(week.features),
      '30d': parseEarthquakes(month.features),
    },
  };
}
