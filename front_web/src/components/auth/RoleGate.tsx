import React from 'react';
import { useAuth, UserRole } from '../../contexts/AuthContext';

interface RoleGateProps {
  children: React.ReactNode;
  /** Roles that are allowed to see this content */
  allowedRoles: UserRole[];
  /** Content to show when user doesn't have access (optional) */
  fallback?: React.ReactNode;
  /** If true, shows content only when user is NOT authenticated */
  showForGuests?: boolean;
}

/**
 * RoleGate component for conditionally rendering content based on user role.
 * 
 * Usage:
 * ```tsx
 * // Show only for admins
 * <RoleGate allowedRoles={['admin']}>
 *   <AdminOnlyContent />
 * </RoleGate>
 * 
 * // Show for admins or providers with fallback
 * <RoleGate 
 *   allowedRoles={['admin', 'provider']} 
 *   fallback={<p>You don't have access</p>}
 * >
 *   <ManagementContent />
 * </RoleGate>
 * 
 * // Show only for guests (not logged in)
 * <RoleGate showForGuests allowedRoles={[]}>
 *   <LoginButton />
 * </RoleGate>
 * ```
 */
export const RoleGate: React.FC<RoleGateProps> = ({
  children,
  allowedRoles,
  fallback = null,
  showForGuests = false,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  // Handle guest-only content
  if (showForGuests) {
    return !isAuthenticated ? <>{children}</> : <>{fallback}</>;
  }

  // Check if user is authenticated and has the required role
  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  if (allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

/**
 * AdminOnly component - shortcut for admin-only content
 */
export const AdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback,
}) => (
  <RoleGate allowedRoles={['admin']} fallback={fallback}>
    {children}
  </RoleGate>
);

/**
 * ProviderOnly component - shortcut for provider-only content
 */
export const ProviderOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback,
}) => (
  <RoleGate allowedRoles={['provider']} fallback={fallback}>
    {children}
  </RoleGate>
);

/**
 * AuthenticatedOnly component - show content only when logged in
 */
export const AuthenticatedOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback,
}) => (
  <RoleGate allowedRoles={['user', 'admin', 'provider']} fallback={fallback}>
    {children}
  </RoleGate>
);

/**
 * GuestOnly component - show content only when NOT logged in
 */
export const GuestOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback,
}) => (
  <RoleGate allowedRoles={[]} showForGuests fallback={fallback}>
    {children}
  </RoleGate>
);

export default RoleGate;

