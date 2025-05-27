
// Authentication and authorization types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'hr_admin' | 'dept_manager' | 'employee' | 'system_admin';
  status?: 'active' | 'remote' | 'inactive' | 'out-of-office' | 'on-leave';
  departmentId?: string;
  departmentName?: string;
  managerId?: string;
  token?: string;
}

export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'approve';
  scope: 'own' | 'department' | 'company';
}

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  hr_admin: [
    // Employee management
    { resource: 'employees', action: 'create', scope: 'company' },
    { resource: 'employees', action: 'read', scope: 'company' },
    { resource: 'employees', action: 'update', scope: 'company' },
    { resource: 'employees', action: 'delete', scope: 'company' },
    
    // Leave management
    { resource: 'absences', action: 'read', scope: 'company' },
    { resource: 'absences', action: 'approve', scope: 'company' },
    
    // Performance management
    { resource: 'performance', action: 'create', scope: 'company' },
    { resource: 'performance', action: 'read', scope: 'company' },
    { resource: 'performance', action: 'update', scope: 'company' },
    
    // Analytics and reports
    { resource: 'analytics', action: 'read', scope: 'company' },
    { resource: 'reports', action: 'create', scope: 'company' },
    
    // Announcements
    { resource: 'announcements', action: 'create', scope: 'company' },
    { resource: 'announcements', action: 'update', scope: 'company' },
    { resource: 'announcements', action: 'delete', scope: 'company' },
    
    // Departments
    { resource: 'departments', action: 'read', scope: 'company' },
    { resource: 'departments', action: 'update', scope: 'company' },
  ],
  
  dept_manager: [
    // Team member information
    { resource: 'employees', action: 'read', scope: 'department' },
    { resource: 'employees', action: 'update', scope: 'department' },
    
    // Leave approval
    { resource: 'absences', action: 'read', scope: 'department' },
    { resource: 'absences', action: 'approve', scope: 'department' },
    
    // Performance management
    { resource: 'performance', action: 'create', scope: 'department' },
    { resource: 'performance', action: 'read', scope: 'department' },
    { resource: 'performance', action: 'update', scope: 'department' },
    
    // Goals management
    { resource: 'goals', action: 'create', scope: 'department' },
    { resource: 'goals', action: 'read', scope: 'department' },
    { resource: 'goals', action: 'update', scope: 'department' },
    
    // Attendance tracking
    { resource: 'timeclock', action: 'read', scope: 'department' },
    
    // Departmental analytics
    { resource: 'analytics', action: 'read', scope: 'department' },
    
    // Departmental announcements
    { resource: 'announcements', action: 'create', scope: 'department' },
    { resource: 'announcements', action: 'update', scope: 'department' },
  ],
  
  employee: [
    // Personal profile
    { resource: 'employees', action: 'read', scope: 'own' },
    { resource: 'employees', action: 'update', scope: 'own' },
    
    // Leave requests
    { resource: 'absences', action: 'create', scope: 'own' },
    { resource: 'absences', action: 'read', scope: 'own' },
    { resource: 'absences', action: 'update', scope: 'own' },
    
    // Performance reviews
    { resource: 'performance', action: 'read', scope: 'own' },
    
    // Goals
    { resource: 'goals', action: 'read', scope: 'own' },
    { resource: 'goals', action: 'update', scope: 'own' },
    
    // Time tracking
    { resource: 'timeclock', action: 'create', scope: 'own' },
    { resource: 'timeclock', action: 'read', scope: 'own' },
    
    // Announcements (read only)
    { resource: 'announcements', action: 'read', scope: 'company' },
  ],
  
  system_admin: [
    // Full system access
    { resource: '*', action: 'create', scope: 'company' },
    { resource: '*', action: 'read', scope: 'company' },
    { resource: '*', action: 'update', scope: 'company' },
    { resource: '*', action: 'delete', scope: 'company' },
    
    // System configuration
    { resource: 'system', action: 'create', scope: 'company' },
    { resource: 'system', action: 'update', scope: 'company' },
    
    // User permissions
    { resource: 'permissions', action: 'create', scope: 'company' },
    { resource: 'permissions', action: 'update', scope: 'company' },
    { resource: 'permissions', action: 'delete', scope: 'company' },
  ]
};

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateRoleRequest {
  userId: string;
  role: 'hr_admin' | 'dept_manager' | 'employee' | 'system_admin';
}
