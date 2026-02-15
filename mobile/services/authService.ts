import { API_ENDPOINTS, apiRequest } from './api';

export interface User {
    id: string;
    _id: string;
    username: string;
    email: string;
    role: string;
    phone?: string;
    address?: string;
    companyName?: string;
    description?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
}

// Login user
export async function login(credentials: LoginCredentials) {
    return apiRequest<AuthResponse>(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
}

// Register new user
export async function register(credentials: RegisterCredentials) {
    return apiRequest<AuthResponse>(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
}

// Verify token
export async function verifyToken(token: string) {
    return apiRequest<{ user: User }>(API_ENDPOINTS.VERIFY, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export default {
    login,
    register,
    verifyToken,
};
