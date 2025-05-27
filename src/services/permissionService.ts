
import { ROLE_PERMISSIONS, Permission, User } from '@/types/auth';
import { getCurrentUser } from './authService';

/**
 * Check if a user has permission to perform an action on a resource
 */
export function hasPermission(
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete' | 'approve',
  scope: 'own' | 'department' | 'company' = 'own',
  user?: User
): boolean {
  const currentUser = user || getCurrentUser();
  if (!currentUser) return false;

  const userPermissions = ROLE_PERMISSIONS[currentUser.role] || [];
  
  // Check for wildcard permissions (system admin)
  const hasWildcard = userPermissions.some(
    p => p.resource === '*' && (p.action === action || p.action === '*' as any)
  );
  
  if (hasWildcard) return true;

  // Check for specific resource permissions
  return userPermissions.some(permission => {
    const resourceMatch = permission.resource === resource;
    const actionMatch = permission.action === action;
    const scopeMatch = 
      permission.scope === 'company' || 
      (permission.scope === 'department' && (scope === 'department' || scope === 'own')) ||
      (permission.scope === 'own' && scope === 'own');
    
    return resourceMatch && actionMatch && scopeMatch;
  });
}

/**
 * Get user role display name
 */
export function getRoleDisplayName(role: string): string {
  const roleNames: Record<string, string> = {
    hr_admin: 'HR Administrator',
    dept_manager: 'Department Manager',
    employee: 'Employee',
    system_admin: 'System Administrator'
  };
  
  return roleNames[role] || 'Unknown Role';
}

/**
 * Check if user is HR Administrator
 */
export function isHRAdmin(user?: User): boolean {
  const currentUser = user || getCurrentUser();
  return currentUser?.role === 'hr_admin';
}

/**
 * Check if user is Department Manager
 */
export function isDepartmentManager(user?: User): boolean {
  const currentUser = user || getCurrentUser();
  return currentUser?.role === 'dept_manager';
}

/**
 * Check if user is System Administrator
 */
export function isSystemAdmin(user?: User): boolean {
  const currentUser = user || getCurrentUser();
  return currentUser?.role === 'system_admin';
}

/**
 * Check if user is regular employee
 */
export function isEmployee(user?: User): boolean {
  const currentUser = user || getCurrentUser();
  return currentUser?.role === 'employee';
}

/**
 * Check if user can manage other users (HR Admin or System Admin)
 */
export function canManageUsers(user?: User): boolean {
  return isHRAdmin(user) || isSystemAdmin(user);
}

/**
 * Check if user can approve leave requests
 */
export function canApproveLeave(user?: User): boolean {
  return hasPermission('absences', 'approve', 'department', user);
}

/**
 * Check if user can view company-wide analytics
 */
export function canViewCompanyAnalytics(user?: User): boolean {
  return hasPermission('analytics', 'read', 'company', user);
}

/**
 * Check if user can create announcements
 */
export function canCreateAnnouncements(scope: 'department' | 'company' = 'department', user?: User): boolean {
  return hasPermission('announcements', 'create', scope, user);
}

/**
 * Get all permissions for a user
 */
export function getUserPermissions(user?: User): Permission[] {
  const currentUser = user || getCurrentUser();
  if (!currentUser) return [];
  
  return ROLE_PERMISSIONS[currentUser.role] || [];
}
