import type { AlertGeometry, WeatherAlert } from '../types/spaceWeather';
import {
  formatAlertRegion,
  formatAreaDescription,
  inferStateAbbr,
  sameFipsToCountyZone,
} from './alertGeography';

export interface NoaaAlertFeature {
  id: string;
  geometry?: AlertGeometry | null;
  properties: {
    event?: string;
    severity?: string;
    urgency?: string;
    areaDesc?: string;
    headline?: string;
    senderName?: string;
    geocode?: {
      UGC?: string[];
      SAME?: string[];
    };
    affectedZones?: string[];
  };
}

function normalizeSeverity(
  severity?: string,
  urgency?: string
): string {
  if (severity && severity.toLowerCase() !== 'unknown') return severity;
  if (urgency && urgency.toLowerCase() !== 'unknown') return urgency;
  return 'Active';
}

function extractZoneIds(feature: NoaaAlertFeature): {
  forecastZoneIds: string[];
  countyZoneIds: string[];
} {
  const forecastZoneIds = new Set<string>();
  const countyZoneIds = new Set<string>();

  for (const url of feature.properties.affectedZones ?? []) {
    const id = url.split('/').pop() ?? '';
    if (!id) continue;
    if (url.includes('/zones/county/')) countyZoneIds.add(id);
    else if (url.includes('/zones/forecast/')) forecastZoneIds.add(id);
    else forecastZoneIds.add(id);
  }

  for (const ugc of feature.properties.geocode?.UGC ?? []) {
    if (ugc.includes('C')) countyZoneIds.add(ugc);
    else forecastZoneIds.add(ugc);
  }

  const stateAbbr = inferStateAbbr(
    feature.properties.areaDesc ?? '',
    feature.properties.senderName
  );

  if (stateAbbr) {
    for (const same of feature.properties.geocode?.SAME ?? []) {
      const countyZone = sameFipsToCountyZone(same, stateAbbr);
      if (countyZone) countyZoneIds.add(countyZone);
    }
  }

  return {
    forecastZoneIds: [...forecastZoneIds],
    countyZoneIds: [...countyZoneIds],
  };
}

export function mapNoaaAlert(feature: NoaaAlertFeature): WeatherAlert {
  const areaDesc = feature.properties.areaDesc ?? '—';
  const senderName = feature.properties.senderName ?? '';
  const stateAbbr = inferStateAbbr(areaDesc, senderName);
  const zones = extractZoneIds(feature);

  return {
    id: feature.id,
    event: feature.properties.event ?? 'Alert',
    severity: normalizeSeverity(
      feature.properties.severity,
      feature.properties.urgency
    ),
    area: formatAreaDescription(areaDesc, stateAbbr),
    headline: feature.properties.headline ?? '—',
    geometry: feature.geometry ?? null,
    region: formatAlertRegion(stateAbbr),
    senderName,
    forecastZoneIds: zones.forecastZoneIds,
    countyZoneIds: zones.countyZoneIds,
  };
}
