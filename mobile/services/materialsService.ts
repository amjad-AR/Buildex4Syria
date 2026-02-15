import { API_ENDPOINTS, apiRequest } from './api';

export interface Material {
    _id: string;
    name: string;
    nameEn: string;
    type: 'wall' | 'floor' | 'ceiling';
    category: string;
    materialType: 'texture' | 'color';
    textureUrl?: string;
    color?: string;
    thumbnailUrl?: string;
    pricePerMeter: number;
    currency: string;
    tags: string[];
    isActive: boolean;
    brand: string;
}

export type MaterialType = 'wall' | 'floor' | 'ceiling';

// Get all materials
export async function getAllMaterials() {
    return apiRequest<Material[]>(API_ENDPOINTS.MATERIALS);
}

// Get materials by type (wall, floor, ceiling)
export async function getMaterialsByType(type: MaterialType) {
    return apiRequest<Material[]>(API_ENDPOINTS.MATERIALS_BY_TYPE(type));
}

// Get walls
export async function getWalls() {
    return getMaterialsByType('wall');
}

// Get floors
export async function getFloors() {
    return getMaterialsByType('floor');
}

// Get ceilings
export async function getCeilings() {
    return getMaterialsByType('ceiling');
}

export default {
    getAllMaterials,
    getMaterialsByType,
    getWalls,
    getFloors,
    getCeilings,
};
