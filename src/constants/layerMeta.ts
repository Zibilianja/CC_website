import type { LayerMeta } from '../types/spaceWeather';

export const LAYER_META: LayerMeta[] = [
  {
    id: 'solar',
    title: 'The Sun',
    altitude: '150 million km above you',
    summary:
      'Where it all starts — solar flares and eruptions send energy and particles toward Earth.',
  },
  {
    id: 'magnetosphere',
    title: 'Earth\'s Shield',
    altitude: 'Thousands of km above the surface',
    summary:
      'Our magnetic field deflects most solar wind. When it weakens, geomagnetic storms follow.',
  },
  {
    id: 'aurora',
    title: 'Upper Atmosphere',
    altitude: '100–400 km — the aurora zone',
    summary:
      'Charged particles collide with atmospheric gases here, creating the northern and southern lights.',
  },
  {
    id: 'troposphere',
    title: 'The Air We Breathe',
    altitude: 'Ground level to ~12 km',
    summary:
      'The weather layer — temperature, storms, and alerts that affect daily life.',
  },
  {
    id: 'ground',
    title: 'The Surface',
    altitude: 'Where we live',
    summary:
      'Wildfires, floods, and space-weather impacts on the ground — what we see and feel at the surface.',
  },
  {
    id: 'subsurface',
    title: 'Subsurface',
    altitude: 'Below your feet',
    summary:
      'Seismic activity beneath the crust — earthquakes detected by global monitoring networks.',
  },
];
