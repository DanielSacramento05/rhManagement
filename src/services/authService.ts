
import { apiRequest } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'employee';
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

export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    const userData = JSON.parse(userStr);
    return userData;
  } catch (e) {
    console.error("Error parsing user data from localStorage:", e);
    return null;
  }
}

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
    token: authResponse.token,
    isAuthenticated: true
  }));
}

export function logout(): void {
  localStorage.removeItem('user');
}
