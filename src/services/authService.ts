
import { apiRequest } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'employee';
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
  return apiRequest<AuthResponse, LoginCredentials>('/auth/login', 'POST', credentials);
}

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  return apiRequest<AuthResponse, RegisterCredentials>('/auth/register', 'POST', credentials);
}

export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export function isAuthenticated(): boolean {
  return !!getCurrentUser();
}

export function saveUserToLocalStorage(authResponse: AuthResponse): void {
  localStorage.setItem('user', JSON.stringify({
    ...authResponse.user,
    isAuthenticated: true,
    token: authResponse.token
  }));
}

export function logout(): void {
  localStorage.removeItem('user');
}
