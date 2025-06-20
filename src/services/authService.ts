import { apiRequest } from './api';
import { User, LoginCredentials, RegisterCredentials, SetPasswordCredentials, UpdateRoleRequest } from '@/types/auth';

// Export AuthResponse interface for use in other files
export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface CheckUserResponse {
  exists: boolean;
  hasPassword: boolean;
  name?: string;
}

export async function checkUserExists(email: string): Promise<CheckUserResponse> {
  console.log('🔍 AuthService: Checking if user exists for email:', email);
  const response = await apiRequest<CheckUserResponse, { email: string }>('/auth/check-user', 'POST', { email });
  console.log('✅ AuthService: Check user response:', response);
  return response;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    console.log('🔐 AuthService: Login attempt with:', credentials.email);
    const response = await apiRequest<AuthResponse, LoginCredentials>('/auth/login', 'POST', credentials);
    console.log('✅ AuthService: Login response received:', response);
    
    // Check if the user status is inactive/deactivated
    if (response?.user?.status === 'inactive') {
      throw new Error('Your account has been deactivated. Please contact an administrator.');
    }
    
    if (response && response.token) {
      saveUserToLocalStorage(response);
    }
    
    return response;
  } catch (error) {
    console.error('❌ AuthService: Login error details:', error);
    throw error;
  }
}

export async function setPassword(credentials: SetPasswordCredentials): Promise<AuthResponse> {
  console.log('🔑 AuthService: Setting password for existing user:', credentials);
  const response = await apiRequest<AuthResponse, SetPasswordCredentials>('/auth/set-password', 'POST', credentials);
  console.log('✅ AuthService: Set password response:', response);
  
  if (response && response.token) {
    // Ensure the user has the out-of-office status
    if (response.user && !response.user.status) {
      response.user.status = 'out-of-office';
    }
    console.log('💾 AuthService: Saving user to localStorage after password set');
    saveUserToLocalStorage(response);
  }
  return response;
}

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  console.log('📝 AuthService: Registering new user:', credentials);
  const response = await apiRequest<AuthResponse, RegisterCredentials>('/auth/register', 'POST', credentials);
  console.log('✅ AuthService: Registration response:', response);
  
  if (response && response.token) {
    // Ensure the user has the out-of-office status
    if (response.user && !response.user.status) {
      response.user.status = 'out-of-office';
    }
    console.log('💾 AuthService: Saving user to localStorage after registration');
    saveUserToLocalStorage(response);
  }
  return response;
}

export const getCurrentUser = (): User | null => {
  try {
    const user = localStorage.getItem('user');
    if (!user) return null;
    
    const userData = JSON.parse(user);
    console.log('Current user from localStorage:', userData);
    
    // Don't migrate roles - use exactly what's stored
    return userData;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Legacy compatibility functions
export const isUserManager = () => {
  const user = getCurrentUser();
  return user?.role === 'dept_manager' || user?.role === 'hr_admin' || user?.role === 'system_admin';
};

export function isAuthenticated(): boolean {
  const user = getCurrentUser();
  return !!user && !!user.token;
}

export function saveUserToLocalStorage(authResponse: AuthResponse): void {
  console.log('💾 AuthService: Saving user to localStorage:', authResponse);
  localStorage.setItem('user', JSON.stringify({
    id: authResponse.user.id,
    name: authResponse.user.name,
    email: authResponse.user.email,
    role: authResponse.user.role,
    status: authResponse.user.status || 'out-of-office',
    departmentId: authResponse.user.departmentId,
    departmentName: authResponse.user.departmentName,
    managerId: authResponse.user.managerId,
    token: authResponse.token,
    isAuthenticated: true
  }));
  console.log('✅ AuthService: User saved to localStorage successfully');
}

export function logout(): void {
  localStorage.removeItem('user');
}

/**
 * Update a user's role (system admin only)
 */
export async function updateUserRole(request: UpdateRoleRequest): Promise<User> {
  try {
    console.log('Updating user role:', request);
    const response = await apiRequest<{ data: User }, { role: string }>(
      `/employees/${request.userId}/role`,
      'PUT',
      { role: request.role }
    );
    
    console.log('Role update response:', response);
    
    // If the user updating their own role, update the local storage
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === request.userId && response.data) {
      const updatedUser = {
        ...currentUser,
        role: response.data.role
      };
      console.log('Updating localStorage with new role:', updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Force a page reload to ensure all components pick up the new role
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

/**
 * Check if the current user is an admin (HR Admin or System Admin)
 */
export function isAdmin(): boolean {
  const user = getCurrentUser();
  console.log('Checking isAdmin for user:', user);
  return user?.role === 'hr_admin' || user?.role === 'system_admin';
}

/**
 * Check if the current user is HR Admin
 */
export function isHRAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === 'hr_admin';
}

/**
 * Check if the current user is System Admin
 */
export function isSystemAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === 'system_admin';
}

/**
 * Check if the current user is Department Manager
 */
export function isDepartmentManager(): boolean {
  const user = getCurrentUser();
  return user?.role === 'dept_manager';
}
