import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginApi, register as registerApi, verifyToken, User, LoginCredentials, RegisterCredentials } from '../services/authService';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
    register: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!token && !!user;

    // Check stored auth on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async (): Promise<boolean> => {
        try {
            setIsLoading(true);
            const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
            const storedUser = await AsyncStorage.getItem(USER_KEY);

            if (storedToken && storedUser) {
                // Verify token with backend
                const { data, error } = await verifyToken(storedToken);

                if (!error && data?.user) {
                    setToken(storedToken);
                    setUser(data.user);
                    return true;
                } else {
                    // Token invalid, clear storage
                    await clearAuth();
                }
            }
            return false;
        } catch (error) {
            console.error('Auth check error:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials: LoginCredentials) => {
        try {
            const { data, error } = await loginApi(credentials);

            if (error || !data) {
                return { success: false, error: error || 'Login failed' };
            }

            // Store auth data
            await AsyncStorage.setItem(TOKEN_KEY, data.token);
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));

            setToken(data.token);
            setUser(data.user);

            return { success: true };
        } catch (error) {
            return { success: false, error: 'Login failed. Please try again.' };
        }
    };

    const register = async (credentials: RegisterCredentials) => {
        try {
            const { data, error } = await registerApi(credentials);

            if (error || !data) {
                return { success: false, error: error || 'Registration failed' };
            }

            // Store auth data
            await AsyncStorage.setItem(TOKEN_KEY, data.token);
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));

            setToken(data.token);
            setUser(data.user);

            return { success: true };
        } catch (error) {
            return { success: false, error: 'Registration failed. Please try again.' };
        }
    };

    const logout = async () => {
        await clearAuth();
    };

    const clearAuth = async () => {
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isLoading,
            isAuthenticated,
            login,
            register,
            logout,
            checkAuth,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
