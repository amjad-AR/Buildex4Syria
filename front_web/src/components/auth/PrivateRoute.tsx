import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  /** Allowed roles for this route. If not specified, any authenticated user can access. */
  allowedRoles?: UserRole[];
  /** Redirect path for unauthenticated users. Defaults to /login */
  redirectTo?: string;
  /** Redirect path when user doesn't have required role. Defaults to / */
  unauthorizedRedirect?: string;
}

/**
 * PrivateRoute component for protecting routes based on authentication and roles.
 * 
 * Usage:
 * ```tsx
 * // Any authenticated user
 * <PrivateRoute>
 *   <Dashboard />
 * </PrivateRoute>
 * 
 * // Admin only
 * <PrivateRoute allowedRoles={['admin']}>
 *   <AdminPanel />
 * </PrivateRoute>
 * 
 * // Admin or Provider
 * <PrivateRoute allowedRoles={['admin', 'provider']}>
 *   <ManagementPanel />
 * </PrivateRoute>
 * ```
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = '/login',
  unauthorizedRedirect = '/',
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user || !allowedRoles.includes(user.role)) {
      // User doesn't have the required role
      // Redirect based on their actual role
      const roleRedirects: Record<UserRole, string> = {
        admin: '/admin/dashboard',
        provider: '/provider/dashboard',
        user: '/dashboard',
      };

      const fallbackRedirect = user ? roleRedirects[user.role] : unauthorizedRedirect;
      return <Navigate to={fallbackRedirect} replace />;
    }
  }

  return <>{children}</>;
};

/**
 * AdminRoute - Shortcut for admin-only routes
 */
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PrivateRoute allowedRoles={['admin']}>{children}</PrivateRoute>
);

/**
 * ProviderRoute - Shortcut for provider-only routes
 */
export const ProviderRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PrivateRoute allowedRoles={['provider']}>{children}</PrivateRoute>
);

/**
 * AdminOrProviderRoute - For routes accessible by both admin and provider
 */
export const AdminOrProviderRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PrivateRoute allowedRoles={['admin', 'provider']}>{children}</PrivateRoute>
);

/**
 * PublicOnlyRoute - For routes that should only be accessible when NOT logged in
 * (e.g., login, register pages)
 */
interface PublicOnlyRouteProps {
  children: React.ReactNode;
  /** Where to redirect authenticated users. Defaults to role-based dashboard */
  redirectTo?: string;
}

export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({
  children,
  redirectTo,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    // Redirect to role-based dashboard or specified path
    const roleRedirects: Record<UserRole, string> = {
      admin: '/admin/dashboard',
      provider: '/provider/dashboard',
      user: '/dashboard',
    };

    const target = redirectTo || roleRedirects[user.role];
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;

