/**
 * API utility for making authenticated requests to the backend.
 * Automatically includes JWT token from localStorage.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'buildex_auth_token';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiOptions extends Omit<RequestInit, 'method' | 'body'> {
  /** Skip automatic token inclusion */
  skipAuth?: boolean;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
  ok: boolean;
}

/**
 * Get the stored authentication token
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Create headers with optional authentication
 */
const createHeaders = (skipAuth: boolean = false, customHeaders?: HeadersInit): Headers => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  if (!skipAuth) {
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  // Merge custom headers
  if (customHeaders) {
    const customHeadersObj = customHeaders instanceof Headers 
      ? Object.fromEntries(customHeaders.entries())
      : customHeaders;
    
    Object.entries(customHeadersObj).forEach(([key, value]) => {
      if (typeof value === 'string') {
        headers.set(key, value);
      }
    });
  }

  return headers;
};

/**
 * Base API request function
 */
async function apiRequest<T>(
  endpoint: string,
  method: HttpMethod,
  body?: unknown,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const { skipAuth = false, headers: customHeaders, ...fetchOptions } = options;
  
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method,
      headers: createHeaders(skipAuth, customHeaders),
      body: body ? JSON.stringify(body) : undefined,
      ...fetchOptions,
    });

    let data: T | null = null;
    let error: string | null = null;

    try {
      const jsonResponse = await response.json();
      
      if (response.ok) {
        data = jsonResponse;
      } else {
        error = jsonResponse.error || jsonResponse.message || 'An error occurred';
      }
    } catch {
      if (!response.ok) {
        error = `HTTP Error: ${response.status} ${response.statusText}`;
      }
    }

    // Handle token expiration
    if (response.status === 401) {
      // Optionally trigger logout or token refresh
      const event = new CustomEvent('auth:unauthorized');
      window.dispatchEvent(event);
    }

    return {
      data,
      error,
      status: response.status,
      ok: response.ok,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Network error',
      status: 0,
      ok: false,
    };
  }
}

/**
 * API methods
 */
export const api = {
  get: <T>(endpoint: string, options?: ApiOptions) => 
    apiRequest<T>(endpoint, 'GET', undefined, options),

  post: <T>(endpoint: string, body?: unknown, options?: ApiOptions) => 
    apiRequest<T>(endpoint, 'POST', body, options),

  put: <T>(endpoint: string, body?: unknown, options?: ApiOptions) => 
    apiRequest<T>(endpoint, 'PUT', body, options),

  patch: <T>(endpoint: string, body?: unknown, options?: ApiOptions) => 
    apiRequest<T>(endpoint, 'PATCH', body, options),

  delete: <T>(endpoint: string, options?: ApiOptions) => 
    apiRequest<T>(endpoint, 'DELETE', undefined, options),
};

/**
 * File upload utility
 */
export const uploadFile = async (
  endpoint: string,
  file: File,
  fieldName: string = 'file',
  additionalData?: Record<string, string>
): Promise<ApiResponse<unknown>> => {
  const formData = new FormData();
  formData.append(fieldName, file);

  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  const token = getToken();
  const headers: HeadersInit = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    let data = null;
    let error: string | null = null;

    try {
      const jsonResponse = await response.json();
      if (response.ok) {
        data = jsonResponse;
      } else {
        error = jsonResponse.error || 'Upload failed';
      }
    } catch {
      if (!response.ok) {
        error = 'Upload failed';
      }
    }

    return { data, error, status: response.status, ok: response.ok };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Upload failed',
      status: 0,
      ok: false,
    };
  }
};

export default api;

