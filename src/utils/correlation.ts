import type {
  AuroraLayerData,
  GroundLayerData,
  MagnetosphereLayerData,
  SolarLayerData,
  SubsurfaceLayerData,
  TroposphereLayerData,
} from '../types/spaceWeather';
import { WEATHER_EVENT_DAYS } from './weatherEvents';

export interface CorrelationStep {
  id: string;
  layer: string;
  label: string;
  time: string | null;
  active: boolean;
}

export function buildCorrelationChain(
  solar: SolarLayerData | null,
  mag: MagnetosphereLayerData | null,
  aurora: AuroraLayerData | null,
  troposphere: TroposphereLayerData | null,
  ground: GroundLayerData | null,
  subsurface: SubsurfaceLayerData | null
): CorrelationStep[] {
  const now = Date.now();

  const latestFlare = solar?.flares[0];
  const latestCme = solar?.cmes[0];
  const kp = mag?.latestKp ?? 0;
  const auroraActive = (aurora?.highLatitudeCount ?? 0) > 100;
  const alertCount = troposphere?.alerts.length ?? 0;
  const weatherEventCount = ground?.weatherEvents.length ?? 0;
  const wildfireCount = ground?.wildfires.length ?? 0;
  const sigQuakes = subsurface?.earthquakes.length ?? 0;
  const impact = ground?.impactScales[0];

  let sunLabel = 'Quiet solar activity';
  let sunTime: string | null = 'Now';
  let sunActive = false;

  if (latestFlare) {
    const hoursAgo = Math.round((now - new Date(latestFlare.peakTime).getTime()) / 3_600_000);
    sunLabel = `Class ${latestFlare.classType} flare detected`;
    sunTime = hoursAgo < 72 ? `${hoursAgo}h ago` : formatDate(latestFlare.peakTime);
    sunActive = hoursAgo < 48;
  } else if (latestCme) {
    const hoursAgo = Math.round((now - new Date(latestCme.startTime).getTime()) / 3_600_000);
    sunLabel = 'Coronal mass ejection observed';
    sunTime = hoursAgo < 72 ? `${hoursAgo}h ago` : formatDate(latestCme.startTime);
    sunActive = hoursAgo < 72;
  } else if (solar?.latestWindSpeed != null) {
    sunLabel = `Solar wind ${Math.round(solar.latestWindSpeed)} km/s`;
  }

  const magActive = kp >= 5;
  const troposphereActive = alertCount > 0;
  const surfaceActive =
    wildfireCount > 10 ||
    weatherEventCount > 50 ||
    (impact != null &&
      (impact.geomagnetic !== 'None' ||
        impact.radioBlackout !== 'None' ||
        impact.solarRadiation !== 'None'));
  const subsurfaceActive = sigQuakes > 0;

  const largestQuake =
    sigQuakes > 0 && subsurface
      ? subsurface.earthquakes.reduce(
          (max, q) => (q.magnitude > max.magnitude ? q : max),
          subsurface.earthquakes[0]
        )
      : null;

  return [
    {
      id: 'solar',
      layer: 'The Sun',
      label: sunLabel,
      time: sunTime,
      active: sunActive,
    },
    {
      id: 'magnetosphere',
      layer: "Earth's shield",
      label:
        kp >= 5
          ? `Geomagnetic storm underway (Kp ${kp.toFixed(1)})`
          : `Quiet geomagnetic conditions (Kp ${kp.toFixed(1)})`,
      time: 'Now',
      active: magActive,
    },
    {
      id: 'aurora',
      layer: 'Upper atmosphere',
      label: auroraActive
        ? 'Aurora activity elevated at high latitudes'
        : 'Aurora activity low',
      time: 'Now',
      active: auroraActive,
    },
    {
      id: 'troposphere',
      layer: 'The air we breathe',
      label:
        alertCount > 0
          ? `${alertCount} US severe weather alert${alertCount === 1 ? '' : 's'} active`
          : 'No major US severe weather alerts',
      time: 'Now',
      active: troposphereActive,
    },
    {
      id: 'ground',
      layer: 'The surface',
      label:
        wildfireCount > 0 || weatherEventCount > 0
          ? `${weatherEventCount} global weather events (${WEATHER_EVENT_DAYS}d) · ${wildfireCount} active wildfires`
          : 'Quiet surface weather conditions',
      time: 'Now',
      active: surfaceActive,
    },
    {
      id: 'subsurface',
      layer: 'Subsurface',
      label:
        largestQuake != null
          ? `${sigQuakes} significant quake${sigQuakes === 1 ? '' : 's'} (24h) · largest M${largestQuake.magnitude.toFixed(1)}`
          : 'No significant earthquakes (24h)',
      time: 'Now',
      active: subsurfaceActive,
    },
  ];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' });
}
