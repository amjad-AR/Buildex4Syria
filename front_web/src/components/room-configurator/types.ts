// Types for Room Configurator
export interface MaterialOption {
  id: string;
  name: string;
  color: string;
  roughness: number;
  metalness: number;
  previewColor: string;
}

export interface AppState {
  wallMaterialId: string;
  floorMaterialId: string;
  autoRotate: boolean;
  lightIntensity: number;
}

export type UpdateStateFn = (updates: Partial<AppState>) => void;

export interface DBMaterial {
  _id: string;
  name: string;
  nameEn: string;
  type: "wall" | "floor" | "ceiling";
  category: string;
  materialType: "texture" | "color";
  textureUrl?: string;
  color?: string;
  roughness: number;
  metalness: number;
  tileSize: number;
  tags: string[];
  isActive: boolean;
  displayOrder: number;
  pricePerMeter?: number;
  currency?: string;
  stock?: number;
  brand?: string;
}

export interface FurnitureItem {
  id: string;
  name: string;
  color: string;
  size: [number, number, number];
  x: number;
  z: number;
  rotation?: number;
}

export interface Dimensions {
  width: number;
  length: number;
  height: number;
}

export interface SelectedMaterial {
  id: string;
  type: "texture" | "color";
  value: string;
  roughness: number;
  metalness: number;
  tileSize: number;
}

export interface SelectedMaterials {
  wall: SelectedMaterial;
  floor: SelectedMaterial;
  ceiling: SelectedMaterial;
  leftWall?: SelectedMaterial;
  rightWall?: SelectedMaterial;
  backWall?: SelectedMaterial;
  frontWall?: SelectedMaterial;
}

export interface BackgroundSettings {
  type: 'color' | 'texture';
  value: string;
}

export interface LightingPreset {
  id: string;
  name: string;
  icon: React.ReactNode;
  ambient: number;
  directional: number;
  color: string;
  description: string;
}
