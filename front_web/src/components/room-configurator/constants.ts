import { MaterialOption } from './types';

export const WALL_MATERIALS: MaterialOption[] = [
  {
    id: 'white-paint',
    name: 'White Paint',
    color: '#F5F5F5',
    roughness: 0.8,
    metalness: 0.0,
    previewColor: '#F5F5F5'
  },
  {
    id: 'beige-plaster',
    name: 'Beige Plaster',
    color: '#E8DCC4',
    roughness: 0.9,
    metalness: 0.0,
    previewColor: '#E8DCC4'
  },
  {
    id: 'dark-wood',
    name: 'Dark Wood',
    color: '#3E2723',
    roughness: 0.6,
    metalness: 0.1,
    previewColor: '#3E2723'
  },
  {
    id: 'concrete-wall',
    name: 'Concrete',
    color: '#A8A8A8',
    roughness: 0.85,
    metalness: 0.0,
    previewColor: '#A8A8A8'
  }
];

export const FLOOR_MATERIALS: MaterialOption[] = [
  {
    id: 'white-marble',
    name: 'White Marble',
    color: '#F0F0F0',
    roughness: 0.2,
    metalness: 0.3,
    previewColor: '#F0F0F0'
  },
  {
    id: 'parquet',
    name: 'Parquet Wood',
    color: '#8B6F47',
    roughness: 0.7,
    metalness: 0.0,
    previewColor: '#8B6F47'
  },
  {
    id: 'polished-concrete',
    name: 'Polished Concrete',
    color: '#6B6B6B',
    roughness: 0.4,
    metalness: 0.2,
    previewColor: '#6B6B6B'
  },
  {
    id: 'dark-tile',
    name: 'Dark Tile',
    color: '#2C2C2C',
    roughness: 0.3,
    metalness: 0.4,
    previewColor: '#2C2C2C'
  }
];

export const ROOM_WIDTH = 5;
export const ROOM_HEIGHT = 3;
export const ROOM_DEPTH = 5;

export const INITIAL_STATE = {
  wallMaterialId: 'white-paint',
  floorMaterialId: 'parquet',
  autoRotate: false,
  lightIntensity: 0.5
};
