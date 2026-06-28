import type { AuroraPoint } from '../types/spaceWeather';
import { normalizeLongitude } from './geo';

/** Aurora is rarely visible to the eye below ~45° latitude. */
export const VIEWING_MIN_LATITUDE = 45;

/** Ignore OVATION noise floor at low intensities. */
export const VIEWING_MIN_INTENSITY = 1;

/** Min |latitude| for globe activity markers (excludes equatorial noise). */
export const ACTIVITY_MIN_LATITUDE = 45;

const INTENSITY_GRID_LON = 360;
const INTENSITY_GRID_LAT = 181;
const HORIZON_LOOK_POLEWARD_DEG = 12;

/**
 * 0–1 score for auroral energy at a grid cell (not yet ground-observer adjusted).
 */
export function computeViewingWeight(
  lat: number,
  intensity: number,
  maxIntensity: number
): number {
  const absLat = Math.abs(lat);
  if (absLat < VIEWING_MIN_LATITUDE || intensity < VIEWING_MIN_INTENSITY) {
    return 0;
  }

  const latFactor = Math.min(1, (absLat - 42) / 28);
  const intFactor = Math.min(1, intensity / Math.max(maxIntensity, 1));
  return latFactor * intFactor;
}

function buildIntensityGrid(points: AuroraPoint[]): Float32Array {
  const grid = new Float32Array(INTENSITY_GRID_LON * INTENSITY_GRID_LAT);
  for (const point of points) {
    const lonIdx =
      Math.round(normalizeLongitude(point.longitude)) + 180;
    const latIdx = Math.round(point.latitude) + 90;
    if (
      lonIdx < 0 ||
      lonIdx >= INTENSITY_GRID_LON ||
      latIdx < 0 ||
      latIdx >= INTENSITY_GRID_LAT
    ) {
      continue;
    }
    const idx = latIdx * INTENSITY_GRID_LON + lonIdx;
    grid[idx] = Math.max(grid[idx], point.intensity);
  }
  return grid;
}

function intensityAtGrid(
  grid: Float32Array,
  lat: number,
  lon: number
): number {
  const lonIdx = Math.round(normalizeLongitude(lon)) + 180;
  const latIdx = Math.round(lat) + 90;
  if (
    lonIdx < 0 ||
    lonIdx >= INTENSITY_GRID_LON ||
    latIdx < 0 ||
    latIdx >= INTENSITY_GRID_LAT
  ) {
    return 0;
  }
  return grid[latIdx * INTENSITY_GRID_LON + lonIdx];
}

/**
 * Ground viewing score: aurora overhead or on the poleward horizon from this location.
 */
export function computeGroundViewingScore(
  grid: Float32Array,
  viewerLat: number,
  viewerLon: number,
  maxIntensity: number
): number {
  const absViewerLat = Math.abs(viewerLat);
  if (absViewerLat < VIEWING_MIN_LATITUDE - 2) return 0;

  let score = computeViewingWeight(
    viewerLat,
    intensityAtGrid(grid, viewerLat, viewerLon),
    maxIntensity
  );

  const polewardStep = viewerLat >= 0 ? 1 : -1;
  for (
    let d = 1;
    d <= HORIZON_LOOK_POLEWARD_DEG;
    d += 1
  ) {
    const auroraLat = viewerLat + polewardStep * d;
    if (auroraLat > 90 || auroraLat < -90) break;

    const horizonWeight =
      computeViewingWeight(
        auroraLat,
        intensityAtGrid(grid, auroraLat, viewerLon),
        maxIntensity
      ) * (1 - d / (HORIZON_LOOK_POLEWARD_DEG + 2));

    score = Math.max(score, horizonWeight);
  }

  return Math.min(1, score);
}

export function viewingPercentAt(
  points: AuroraPoint[],
  lat: number,
  lon: number,
  maxIntensity: number
): number {
  const grid = buildIntensityGrid(points);
  return Math.round(
    computeGroundViewingScore(grid, lat, lon, maxIntensity) * 100
  );
}

/** Evenly sample activity markers across longitude so the globe is not biased. */
export function sampleGlobeActivityMarkers(
  points: AuroraPoint[],
  targetCount = 3000
): AuroraPoint[] {
  const active = points.filter((p) => p.intensity > 0);
  if (active.length <= targetCount) return active;

  const byLon = new Map<number, AuroraPoint[]>();
  for (const point of active) {
    const bin = Math.floor(normalizeLongitude(point.longitude) / 6);
    const bucket = byLon.get(bin) ?? [];
    bucket.push(point);
    byLon.set(bin, bucket);
  }

  const perBin = Math.ceil(targetCount / byLon.size);
  const sampled: AuroraPoint[] = [];

  for (const bucket of byLon.values()) {
    const step = Math.max(1, Math.floor(bucket.length / perBin));
    for (let i = 0; i < bucket.length && sampled.length < targetCount; i += step) {
      sampled.push(bucket[i]);
    }
  }

  return sampled.slice(0, targetCount);
}

function boxBlur(
  grid: Float32Array,
  width: number,
  height: number,
  radius: number
): Float32Array {
  const out = new Float32Array(grid.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let count = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = (x + dx + width) % width;
          const ny = Math.max(0, Math.min(height - 1, y + dy));
          sum += grid[ny * width + nx];
          count += 1;
        }
      }
      out[y * width + x] = sum / count;
    }
  }
  return out;
}

/**
 * Equirectangular raster for the flat viewing-opportunity map.
 * Scores each ground location (not raw aurora cells) for overhead + horizon visibility.
 */
export function buildViewingOpportunityCanvas(
  points: AuroraPoint[],
  maxIntensity: number
): HTMLCanvasElement {
  const width = 720;
  const height = 360;
  const grid = new Float32Array(width * height);
  const intensityGrid = buildIntensityGrid(points);

  for (let y = 0; y < height; y++) {
    const lat = 90 - (y / (height - 1)) * 180;
    if (Math.abs(lat) < VIEWING_MIN_LATITUDE - 3) continue;

    for (let x = 0; x < width; x++) {
      const lon = (x / (width - 1)) * 360 - 180;
      const score = computeGroundViewingScore(
        intensityGrid,
        lat,
        lon,
        maxIntensity
      );
      if (score > 0) {
        grid[y * width + x] = score;
      }
    }
  }

  const blurred = boxBlur(grid, width, height, 5);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const imageData = ctx.createImageData(width, height);
  for (let i = 0; i < blurred.length; i++) {
    const w = blurred[i];
    if (w <= 0.015) continue;
    const px = i * 4;
    imageData.data[px] = Math.round(70 + w * 120);
    imageData.data[px + 1] = Math.round(190 + w * 65);
    imageData.data[px + 2] = Math.round(90 + w * 50);
    imageData.data[px + 3] = Math.round(60 + w * 195);
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export function canvasToDataUrl(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png');
}
