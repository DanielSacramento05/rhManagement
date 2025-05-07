import { apiRequest } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'employee';
  status?: 'active' | 'remote' | 'inactive' | 'out-of-office';
  token?: string;
}

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

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    console.log('Login attempt with:', credentials.email);
    const response = await apiRequest<AuthResponse, LoginCredentials>('/auth/login', 'POST', credentials);
    console.log('Login response received:', response);
    
    // Check if the user status is inactive/deactivated
    if (response?.user?.status === 'inactive') {
      throw new Error('Your account has been deactivated. Please contact an administrator.');
    }
    
    if (response && response.token) {
      saveUserToLocalStorage(response);
    }
    
    return response;
  } catch (error) {
    console.error('Login error details:', error);
    throw error;
  }
}

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse, RegisterCredentials>('/auth/register', 'POST', credentials);
  if (response && response.token) {
    saveUserToLocalStorage(response);
  }
  return response;
}

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    if (!user) return null;
    
    const userData = JSON.parse(user);
    
    // Make sure role is properly set
    if (!userData.role && userData.position) {
      // Use position to determine role if role is not explicitly set
      userData.role = userData.position.toLowerCase().includes('manager') || 
                     userData.position.toLowerCase().includes('director') || 
                     userData.position.toLowerCase().includes('admin') ? 'manager' : 'employee';
    }
    
    return userData;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const isUserManager = () => {
  const user = getCurrentUser();
  return user?.role === 'manager' || user?.role === 'admin';
};

export function isAuthenticated(): boolean {
  const user = getCurrentUser();
  return !!user && !!user.token;
}

export function saveUserToLocalStorage(authResponse: AuthResponse): void {
  console.log('Saving user to localStorage:', authResponse);
  localStorage.setItem('user', JSON.stringify({
    id: authResponse.user.id,
    name: authResponse.user.name,
    email: authResponse.user.email,
    role: authResponse.user.role,
    status: authResponse.user.status,
    token: authResponse.token,
    isAuthenticated: true
  }));
}

export function logout(): void {
  localStorage.removeItem('user');
}
