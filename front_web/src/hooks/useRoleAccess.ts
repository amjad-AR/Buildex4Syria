import { useMemo } from 'react';
import { useAuth, UserRole } from '../contexts/AuthContext';

interface RoleAccess {
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Whether the user is loading */
  isLoading: boolean;
  /** Current user role or null */
  role: UserRole | null;
  /** Check if user has a specific role */
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  /** Check if user is an admin */
  isAdmin: boolean;
  /** Check if user is a provider */
  isProvider: boolean;
  /** Check if user is a regular user */
  isUser: boolean;
  /** Check if user can access admin features */
  canAccessAdmin: boolean;
  /** Check if user can access provider features */
  canAccessProvider: boolean;
  /** Get the dashboard path for the current user */
  dashboardPath: string;
}

/**
 * Hook for role-based access control in components.
 * 
 * Usage:
 * ```tsx
 * const { isAdmin, canAccessProvider, hasRole } = useRoleAccess();
 * 
 * return (
 *   <div>
 *     {isAdmin && <AdminMenu />}
 *     {hasRole(['admin', 'provider']) && <ManagementFeatures />}
 *   </div>
 * );
 * ```
 */
export const useRoleAccess = (): RoleAccess => {
  const { user, isAuthenticated, isLoading, getRole, isAdmin, isProvider } = useAuth();

  return useMemo(() => {
    const role = getRole();
    const adminCheck = isAdmin();
    const providerCheck = isProvider();

    const hasRole = (roles: UserRole | UserRole[]): boolean => {
      if (!role) return false;
      const rolesArray = Array.isArray(roles) ? roles : [roles];
      return rolesArray.includes(role);
    };

    const getDashboardPath = (): string => {
      switch (role) {
        case 'admin':
          return '/admin/dashboard';
        case 'provider':
          return '/provider/dashboard';
        case 'user':
          return '/dashboard';
        default:
          return '/';
      }
    };

    return {
      isAuthenticated,
      isLoading,
      role,
      hasRole,
      isAdmin: adminCheck,
      isProvider: providerCheck,
      isUser: role === 'user',
      canAccessAdmin: adminCheck,
      canAccessProvider: providerCheck || adminCheck,
      dashboardPath: getDashboardPath(),
    };
  }, [user, isAuthenticated, isLoading, getRole, isAdmin, isProvider]);
};

export default useRoleAccess;

