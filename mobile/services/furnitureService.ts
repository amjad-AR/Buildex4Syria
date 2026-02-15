import { API_ENDPOINTS, apiRequest } from './api';

export interface Furniture {
    _id: string;
    name: string;
    nameEn: string;
    category: string;
    description: string;
    price: number;
    currency: string;
    dimensions: {
        width: number;
        height: number;
        depth: number;
    };
    defaultColor: string;
    availableColors: Array<{ name: string; hex: string }>;
    imageUrl?: string;
    icon: string;
    material: string;
    weight: number;
    stock: number;
    tags: string[];
    brand: string;
    isActive: boolean;
}

// Get all furniture
export async function getAllFurniture() {
    return apiRequest<Furniture[]>(API_ENDPOINTS.FURNITURE);
}

// Get furniture by category
export async function getFurnitureByCategory(category: string) {
    return apiRequest<Furniture[]>(`${API_ENDPOINTS.FURNITURE}?category=${category}`);
}

export default {
    getAllFurniture,
    getFurnitureByCategory,
};
