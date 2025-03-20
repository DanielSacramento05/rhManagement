
import { PaginationParams } from '@/types';

// Base API configuration
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Common headers
const getHeaders = () => {
  // You can add auth tokens here when you implement authentication
  return {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
  };
};

// Generic API request function
export async function apiRequest<T, D = undefined>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: D,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  // Construct URL with query parameters
  const url = new URL(`${API_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // Prepare request options
  const options: RequestInit = {
    method,
    headers: getHeaders(),
  };

  // Add body for non-GET requests
  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url.toString(), options);
    
    // Parse JSON response
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'An error occurred while making the request');
    }
    
    return result;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Helper function to convert PaginationParams to URL query parameters
export function buildQueryParams(params?: Record<string, any>): Record<string, string | number | boolean | undefined> {
  if (!params) return {};
  
  // Filter out undefined values
  return Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string | number | boolean | undefined>);
}
