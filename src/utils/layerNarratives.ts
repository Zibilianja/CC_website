import type {
  AuroraLayerData,
  GroundLayerData,
  LayerId,
  MagnetosphereLayerData,
  SolarLayerData,
  SubsurfaceLayerData,
  TroposphereLayerData,
} from '../types/spaceWeather';
import {
  formatDistance,
  formatRadiusLabel,
  formatTemperature,
  type UnitSystem,
} from './localeUnits';
import { NEARBY_EARTHQUAKE_RADIUS_KM } from './earthquake';

export interface LayerNarrative {
  headline: string;
  body: string;
  tone: 'calm' | 'watch' | 'alert' | 'neutral';
}

function windDescription(speed: number): string {
  if (speed >= 600) return 'very fast — elevated storm potential';
  if (speed >= 450) return 'brisk — typical of unsettled space weather';
  if (speed >= 300) return 'moderate';
  return 'relatively calm';
}

export function narrateSolar(data: SolarLayerData): LayerNarrative {
  const speed = data.latestWindSpeed;
  const flareCount = data.flares.length;
  const cmeCount = data.cmes.length;
  const latestFlare = data.flares[0];

  let headline = 'The Sun is relatively quiet right now.';
  let tone: LayerNarrative['tone'] = 'calm';

  if (flareCount > 0 || cmeCount > 0) {
    headline =
      flareCount > 0
        ? `Recent solar activity: ${flareCount} flare${flareCount === 1 ? '' : 's'} in the last two weeks.`
        : `${cmeCount} coronal mass ejection${cmeCount === 1 ? '' : 's'} tracked recently.`;
    tone = 'watch';
  }

  const parts: string[] = [];

  if (speed != null) {
    parts.push(
      `Solar wind is flowing at about ${Math.round(speed)} km/s — ${windDescription(speed)}.`
    );
  }

  if (latestFlare) {
    parts.push(
      `The most recent notable flare was class ${latestFlare.classType}, peaking ${formatFriendlyDate(latestFlare.peakTime)}.`
    );
  } else if (flareCount === 0) {
    parts.push('No significant flares have been reported in the past two weeks.');
  }

  if (cmeCount > 0) {
    parts.push(
      `${cmeCount} coronal mass ejection${cmeCount === 1 ? ' has' : 's have'} been logged — these can arrive at Earth days later and stir up geomagnetic activity.`
    );
  }

  return { headline, body: parts.join(' '), tone };
}

export function narrateMagnetosphere(data: MagnetosphereLayerData): LayerNarrative {
  const kp = data.latestKp ?? 0;
  let tone: LayerNarrative['tone'] = 'calm';
  let headline = 'Earth\'s magnetic field is quiet.';

  if (kp >= 7) {
    headline = 'Strong geomagnetic storm conditions.';
    tone = 'alert';
  } else if (kp >= 5) {
    headline = 'Geomagnetic storm conditions are active.';
    tone = 'watch';
  } else if (kp >= 4) {
    headline = 'Unsettled geomagnetic conditions.';
    tone = 'watch';
  }

  const body = [
    `The planetary Kp index is ${kp.toFixed(1)} on a 0–9 scale — ${data.stormLevel.toLowerCase()}.`,
    kp >= 5
      ? 'Satellites, power grids, and radio communications can be affected during stronger storms.'
      : 'No significant impacts to infrastructure are expected at this level.',
  ].join(' ');

  return { headline, body, tone };
}

export function narrateAurora(data: AuroraLayerData): LayerNarrative {
  const active = data.highLatitudeCount > 0;
  const northLine = data.viewlineNorth.find((l) => l.includes('poleward'));
  let tone: LayerNarrative['tone'] = active ? 'watch' : 'calm';

  const headline = active
    ? 'Aurora activity is present at high latitudes.'
    : 'Aurora activity is minimal right now.';

  const body = active
    ? [
        northLine ?? 'Northern lights may be visible in polar regions.',
        `The OVATION model shows activity across ${data.highLatitudeCount.toLocaleString()} high-latitude zones.`,
      ].join(' ')
    : 'Conditions are not favorable for widespread aurora visibility. Check back after the next geomagnetic disturbance.';

  return { headline, body, tone };
}

export function narrateTroposphere(
  data: TroposphereLayerData,
  unitSystem: UnitSystem = 'metric',
  context?: { localAlertCount?: number }
): LayerNarrative {
  const alertCount = data.alerts.length;
  const weather = data.openWeather;

  let tone: LayerNarrative['tone'] = 'neutral';
  let headline = 'Surface weather is typical for this season.';

  if (alertCount > 0) {
    headline = `${alertCount} severe weather alert${alertCount === 1 ? '' : 's'} active across the United States.`;
    tone = 'watch';
  }

  const parts: string[] = [];

  if (weather) {
    parts.push(
      `In ${weather.location}, it's ${formatTemperature(weather.tempC, unitSystem)} with ${weather.description}. Humidity is ${weather.humidity}%.`
    );
  }

  if (alertCount > 0) {
    const top = data.alerts[0];
    parts.push(`Most prominent alert: ${top.event} (${top.severity}) affecting ${top.area}.`);
  } else if (context?.localAlertCount === 0) {
    parts.push('No active weather alerts for your area.');
  } else {
    parts.push('No major US severe weather alerts are active at the moment.');
  }

  return { headline, body: parts.join(' '), tone };
}

export function narrateSurface(data: GroundLayerData): LayerNarrative {
  const impact = data.impactScales[0];
  const fireCount = data.wildfires.length;
  const weatherCount = data.weatherEvents.length;

  const impactNote = impact
    ? `Space weather impacts: radio ${impact.radioBlackout}, radiation ${impact.solarRadiation}, geomagnetic ${impact.geomagnetic}.`
    : '';

  let tone: LayerNarrative['tone'] = 'neutral';
  let headline = 'Surface conditions are typical for this season.';

  if (fireCount > 20 || weatherCount > 100) {
    headline = 'Elevated surface weather activity worldwide.';
    tone = 'watch';
  }

  const parts: string[] = [];
  if (weatherCount > 0) {
    parts.push(
      `${weatherCount} damaging weather event${weatherCount === 1 ? '' : 's'} tracked globally over the last two weeks.`
    );
  }
  if (fireCount > 0) {
    parts.push(
      `${fireCount} active wildfire${fireCount === 1 ? '' : 's'} in NASA EONET.`
    );
  }
  if (impactNote) parts.push(impactNote);

  if (!parts.length) {
    return {
      headline: 'Quiet at the surface.',
      body: 'No major wildfires or global weather events in this snapshot.',
      tone: 'calm',
    };
  }

  return { headline, body: parts.join(' '), tone };
}

export function narrateSubsurface(
  data: SubsurfaceLayerData,
  context?: {
    nearbyCount?: number;
    closestPlace?: string;
    closestMagnitude?: number;
    closestDistanceKm?: number;
    radiusKm?: number;
    locationKnown?: boolean;
    unitSystem?: UnitSystem;
  }
): LayerNarrative {
  const count = data.earthquakes.length;

  if (count === 0 && !context?.locationKnown) {
    return {
      headline: 'No significant earthquakes in the last 24 hours.',
      body: 'The USGS reports no major seismic events today.',
      tone: 'calm',
    };
  }

  const largest =
    count > 0
      ? data.earthquakes.reduce(
          (max, q) => (q.magnitude > max.magnitude ? q : max),
          data.earthquakes[0]
        )
      : null;

  const localParts: string[] = [];
  const unitSystem = context?.unitSystem ?? 'metric';
  const radiusKm = context?.radiusKm ?? NEARBY_EARTHQUAKE_RADIUS_KM;
  const radiusLabel = formatRadiusLabel(radiusKm, unitSystem);

  if (context?.locationKnown) {
    if ((context.nearbyCount ?? 0) === 0) {
      localParts.push(
        `No M2.5+ events within ${radiusLabel} of you in the selected period.`
      );
    } else {
      localParts.push(
        `${context.nearbyCount} event${context.nearbyCount === 1 ? '' : 's'} within ${radiusLabel} of you.`
      );
      if (
        context.closestPlace != null &&
        context.closestMagnitude != null &&
        context.closestDistanceKm != null
      ) {
        localParts.push(
          `Closest: M${context.closestMagnitude.toFixed(1)} · ${formatDistance(context.closestDistanceKm, unitSystem)} · ${context.closestPlace}.`
        );
      }
    }
  }

  if (count === 0) {
    return {
      headline: 'Quiet globally, with no significant USGS events in 24h.',
      body: localParts.join(' ') || 'No major seismic activity reported.',
      tone: 'calm',
    };
  }

  return {
    headline: `${count} significant earthquake${count === 1 ? '' : 's'} in the last 24 hours.`,
    body: [
      `Largest: magnitude ${largest!.magnitude.toFixed(1)} near ${largest!.place}.`,
      localParts.join(' '),
    ]
      .filter(Boolean)
      .join(' '),
    tone: largest!.magnitude >= 6 ? 'alert' : 'watch',
  };
}

export function narrateLayer(id: LayerId, data: unknown): LayerNarrative | null {
  switch (id) {
    case 'solar':
      return narrateSolar(data as SolarLayerData);
    case 'magnetosphere':
      return narrateMagnetosphere(data as MagnetosphereLayerData);
    case 'aurora':
      return narrateAurora(data as AuroraLayerData);
    case 'troposphere':
      return narrateTroposphere(data as TroposphereLayerData);
    case 'ground':
      return narrateSurface(data as GroundLayerData);
    case 'subsurface':
      return narrateSubsurface(data as SubsurfaceLayerData);
    default:
      return null;
  }
}

export function buildCascadeSummary(
  solar: SolarLayerData | null,
  mag: MagnetosphereLayerData | null,
  troposphere: TroposphereLayerData | null,
  unitSystem: UnitSystem = 'metric'
): string {
  const parts: string[] = [];

  if (solar?.latestWindSpeed != null) {
    parts.push(`solar wind ${windDescription(solar.latestWindSpeed)}`);
  }
  if (mag?.latestKp != null) {
    parts.push(
      mag.latestKp >= 5 ? 'geomagnetic storms active' : 'quiet geomagnetic conditions'
    );
  }
  if (troposphere?.openWeather) {
    parts.push(
      `${troposphere.openWeather.location} ${formatTemperature(troposphere.openWeather.tempC, unitSystem)}`
    );
  }

  if (!parts.length) return 'Loading snapshot…';
  return `Right now: ${parts.join(', ')}.`;
}

function formatFriendlyDate(iso: string): string {
  return new Date(iso).toLocaleString([], {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
