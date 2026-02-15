import { API_ENDPOINTS, apiRequest } from './api';

export interface UsedMaterial {
    materialId: string;
    name: string;
    nameEn: string;
    type: 'wall' | 'floor' | 'ceiling';
    materialType: 'texture' | 'color';
    value: string;
    pricePerMeter: number;
    area: number;
    totalPrice: number;
}

export interface UsedFurniture {
    furnitureId: string;
    id: string;
    name: string;
    nameEn: string;
    color: string;
    price: number;
    quantity: number;
}

export interface ProjectPricing {
    materialsCost: number;
    furnitureCost: number;
    additionalCost: number;
    discount: number;
    taxRate: number;
    taxAmount: number;
    totalPrice: number;
    currency: string;
}

export interface Project {
    _id: string;
    name: string;
    description: string;
    creatorName: string;
    dimensions: {
        width: number;
        length: number;
        height: number;
    };
    materials: {
        wall?: UsedMaterial;
        floor?: UsedMaterial;
        ceiling?: UsedMaterial;
        leftWall?: UsedMaterial;
        rightWall?: UsedMaterial;
        backWall?: UsedMaterial;
        frontWall?: UsedMaterial;
    };
    furniture: UsedFurniture[];
    screenshot: string;
    pricing: ProjectPricing;
    calculatedAreas: {
        floorArea: number;
        ceilingArea: number;
        wallsArea: number;
        totalArea: number;
    };
    status: 'draft' | 'in_progress' | 'completed' | 'archived';
    isPublic: boolean;
    views: number;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

// Get all projects
export async function getAllProjects(params?: {
    status?: string;
    isPublic?: boolean;
    sort?: string;
}) {
    let url = API_ENDPOINTS.PROJECTS;
    const queryParams = new URLSearchParams();

    if (params?.status) queryParams.append('status', params.status);
    if (params?.isPublic !== undefined) queryParams.append('isPublic', String(params.isPublic));
    if (params?.sort) queryParams.append('sort', params.sort);

    if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
    }

    return apiRequest<Project[]>(url);
}

// Get project by ID
export async function getProjectById(id: string) {
    return apiRequest<Project>(API_ENDPOINTS.PROJECT_BY_ID(id));
}

// Search projects
export async function searchProjects(query: string) {
    const { data, error } = await getAllProjects();

    if (error || !data) {
        return { data: null, error };
    }

    const filtered = data.filter(project =>
        project.name.toLowerCase().includes(query.toLowerCase()) ||
        project.description.toLowerCase().includes(query.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );

    return { data: filtered, error: null };
}

export default {
    getAllProjects,
    getProjectById,
    searchProjects,
};
