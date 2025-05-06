
import { PaginationParams } from '@/types';

// Base API configuration
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Common headers
const getHeaders = () => {
  const user = localStorage.getItem('user');
  const token = user ? JSON.parse(user).token : null;
  
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
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

  console.log(`Making API request to: ${url.toString()}`);
  console.log('Request method:', method);
  console.log('Request headers:', getHeaders());
  if (data) console.log('Request data:', JSON.stringify(data));

  // Prepare request options without credentials to avoid CORS issues
  const options: RequestInit = {
    method,
    headers: getHeaders(),
    mode: 'cors'
  };

  // Add body for non-GET requests
  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url.toString(), options);
    console.log('Response status:', response.status);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
      console.log('Response data:', result);
      
      if (!response.ok) {
        throw new Error(result.error || 'An error occurred while making the request');
      }
      
      return result;
    } else {
      const text = await response.text();
      console.log('Response text:', text);
      
      if (!response.ok) {
        throw new Error(text || 'An error occurred while making the request');
      }
      
      // If the API returns a non-JSON response but it's successful, 
      // try to parse it anyway or return an empty object
      try {
        return JSON.parse(text) as T;
      } catch (e) {
        return {} as T;
      }
    }
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
