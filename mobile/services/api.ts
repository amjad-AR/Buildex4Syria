// Base API configuration
// For web browser: use localhost
// For Android emulator: use 10.0.2.2
// For iOS simulator: use localhost  
// For physical devices: use your machine's IP (e.g., 192.168.1.X)
const API_BASE_URL = 'http://10.0.2.2:5000/api';


export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  VERIFY: `${API_BASE_URL}/auth/verify`,

  // Materials
  MATERIALS: `${API_BASE_URL}/materials`,
  MATERIALS_BY_TYPE: (type: string) => `${API_BASE_URL}/materials?type=${type}`,

  // Furniture
  FURNITURE: `${API_BASE_URL}/furniture`,

  // Projects
  PROJECTS: `${API_BASE_URL}/projects`,
  PROJECT_BY_ID: (id: string) => `${API_BASE_URL}/projects/${id}`,

  // Orders
  ORDERS: `${API_BASE_URL}/orders`,
  ORDER_FROM_PROJECT: (projectId: string) => `${API_BASE_URL}/orders/from-project/${projectId}`,

  // Health
  HEALTH: `${API_BASE_URL}/health`,
};

// API request helper with error handling
export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: data.error || data.message || 'Request failed'
      };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

export default API_ENDPOINTS;
