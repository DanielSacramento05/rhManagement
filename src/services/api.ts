import { PaginationParams } from '@/types';

// Base API configuration
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://149.90.159.9:5000/api';

// Common headers
const getHeaders = () => {
  const user = localStorage.getItem('user');
  const token = user ? JSON.parse(user).token : null;
  
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Error handling helper
const handleApiError = (error: any, url: string, method: string) => {
  console.error(`API request failed for ${method} ${url}:`, error);
  
  if (error instanceof TypeError) {
    // Special handling for CORS issues
    if (error.message.includes('CORS') || 
        error.message.includes('Access-Control-Allow-Origin')) {
      const errorMessage = 'Cross-Origin Request Blocked: The server has CORS configuration issues. ' +
                          'This may be caused by multiple Access-Control-Allow-Origin headers. ' + 
                          'Please contact your administrator.';
      console.error(errorMessage);
      throw new Error(errorMessage);
    } else {
      throw new Error('Network connection error. Please check your internet connection and try again.');
    }
  }
  
  // Handle specific HTTP error codes
  if (error.status === 401) {
    throw new Error('Authentication error: Your session may have expired. Please log in again.');
  }
  
  if (error.status === 403) {
    throw new Error('Permission denied: You do not have access to this resource.');
  }
  
  if (error.status === 404) {
    throw new Error('Resource not found: The requested data does not exist.');
  }
  
  if (error.status >= 500) {
    throw new Error('Server error: The server encountered an error. Please try again later.');
  }
  
  // Default error message
  throw new Error(error.message || 'An unexpected error occurred. Please try again.');
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

  // Prepare request options
  const options: RequestInit = {
    method,
    headers: getHeaders(),
    // Don't include credentials to avoid preflight issues
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
        const errorMessage = result.error || `Error ${response.status}: ${response.statusText}`;
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        throw error;
      }
      
      return result;
    } else {
      const text = await response.text();
      console.log('Response text:', text);
      
      if (!response.ok) {
        const errorMessage = text || `Error ${response.status}: ${response.statusText}`;
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        throw error;
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
    return handleApiError(error, url.toString(), method);
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
