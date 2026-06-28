export type LayerId =
  | 'solar'
  | 'magnetosphere'
  | 'aurora'
  | 'troposphere'
  | 'ground'
  | 'subsurface';

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

export interface LayerMeta {
  id: LayerId;
  title: string;
  altitude: string;
  summary: string;
}

export interface SolarFlareEvent {
  id: string;
  beginTime: string;
  peakTime: string;
  classType: string;
  sourceLocation: string;
}

export interface CmeEvent {
  id: string;
  startTime: string;
  activityId: string;
  note: string;
  type: string;
}

export interface SolarWindReading {
  time: string;
  speed: number;
  density: number;
  bt: number;
}

export interface XRayReading {
  time: string;
  flux: number;
  satellite: number;
}

export interface SolarLayerData {
  flares: SolarFlareEvent[];
  cmes: CmeEvent[];
  solarWind: SolarWindReading[];
  xray: XRayReading[];
  latestWindSpeed: number | null;
  latestXrayFlux: number | null;
}

export interface KpReading {
  time: string;
  kp: number;
}

export interface NoaaScaleEntry {
  date: string;
  radioBlackout: string;
  solarRadiation: string;
  geomagnetic: string;
}

export interface MagnetosphereLayerData {
  kpSeries: KpReading[];
  latestKp: number | null;
  stormLevel: string;
  scales: NoaaScaleEntry[];
}

export interface AuroraPoint {
  longitude: number;
  latitude: number;
  intensity: number;
}

export interface AuroraLayerData {
  /** High-latitude OVATION cells for the activity globe (|lat| ≥ 45°, intensity > 0). */
  activityPoints: AuroraPoint[];
  /** All OVATION cells with intensity > 0 — used for viewing map & city lookup. */
  ovationPoints: AuroraPoint[];
  highLatitudeCount: number;
  maxIntensity: number;
  viewlineNorth: string[];
  viewlineSouth: string[];
}

export interface AlertGeometry {
  type: 'Point' | 'Polygon' | 'MultiPolygon';
  coordinates: unknown;
}

export interface WeatherAlert {
  id: string;
  event: string;
  severity: string;
  area: string;
  headline: string;
  geometry: AlertGeometry | null;
  region: string;
  senderName: string;
  forecastZoneIds: string[];
  countyZoneIds: string[];
}

export interface NaturalEvent {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  eventType: WeatherEventType;
  date: string;
  latitude: number | null;
  longitude: number | null;
}

export type WeatherEventType =
  | 'wildfires'
  | 'hurricanes'
  | 'tornadoes'
  | 'severeThunderstorms'
  | 'hail'
  | 'floods'
  | 'snow'
  | 'landslides'
  | 'drought'
  | 'tempExtremes'
  | 'dustHaze'
  | 'other';

export interface OpenWeatherSnapshot {
  location: string;
  tempC: number;
  humidity: number;
  description: string;
  windSpeed: number;
  windDeg: number;
  /** OpenWeather AQI 1–5 (1 = good). */
  airQualityIndex: number | null;
  airQualityLabel: string | null;
  uvIndex: number | null;
  /** Next forecast period probability of precipitation, 0–100. */
  precipChance: number | null;
}

export interface WildfireEvent {
  id: string;
  title: string;
  date: string;
  latitude: number | null;
  longitude: number | null;
  geometry: AlertGeometry | null;
}

export interface TroposphereLayerData {
  alerts: WeatherAlert[];
  openWeather: OpenWeatherSnapshot | null;
  openWeatherConfigured: boolean;
  openWeatherError: string | null;
}

export interface EarthquakeFeature {
  id: string;
  magnitude: number;
  place: string;
  time: string;
  depthKm: number;
  latitude: number;
  longitude: number;
}

export type EarthquakeTimeframe = '1h' | '24h' | '7d' | '30d';

export interface GroundLayerData {
  impactScales: NoaaScaleEntry[];
  weatherEvents: NaturalEvent[];
  wildfires: WildfireEvent[];
  wildfireRegionCount: number;
  wildfireCappedRegions: string[];
}

export interface SubsurfaceLayerData {
  /** USGS significant earthquakes, past 24 hours (insight narrative). */
  earthquakes: EarthquakeFeature[];
  earthquakesByTimeframe: Record<EarthquakeTimeframe, EarthquakeFeature[]>;
}

export interface LayerState<T> {
  status: FetchStatus;
  error: string | null;
  data: T | null;
  fetchedAt: string | null;
}

export interface DashboardSnapshot {
  solar: LayerState<SolarLayerData>;
  magnetosphere: LayerState<MagnetosphereLayerData>;
  aurora: LayerState<AuroraLayerData>;
  troposphere: LayerState<TroposphereLayerData>;
  ground: LayerState<GroundLayerData>;
  subsurface: LayerState<SubsurfaceLayerData>;
}
