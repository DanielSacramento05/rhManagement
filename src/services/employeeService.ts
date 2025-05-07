
import { apiRequest, buildQueryParams } from './api';
import { 
  Employee, 
  EmployeeFilters, 
  ApiResponse, 
  PaginatedResponse 
} from '@/types';

const ENDPOINT = '/employees';

/**
 * Get all employees with optional filtering and pagination
 * @param filters Filtering and pagination options
 * @returns Paginated list of employees
 */
export const getEmployees = async (
  filters?: EmployeeFilters
): Promise<PaginatedResponse<Employee>> => {
  return apiRequest<PaginatedResponse<Employee>>(
    ENDPOINT, 
    'GET', 
    undefined, 
    buildQueryParams(filters)
  );
};

/**
 * Get a specific employee by ID
 * @param id Employee ID
 * @returns Employee details
 */
export const getEmployeeById = async (
  id: string
): Promise<ApiResponse<Employee>> => {
  const response = await apiRequest<ApiResponse<Employee>>(`${ENDPOINT}/${id}`);
  
  // Map image_url to imageUrl for frontend compatibility
  if (response.data && response.data.image_url) {
    response.data.imageUrl = response.data.image_url;
  }
  
  return response;
};

/**
 * Create a new employee
 * @param employee Employee data
 * @returns Created employee
 */
export const createEmployee = async (
  employee: Omit<Employee, 'id'>
): Promise<ApiResponse<Employee>> => {
  // Convert imageUrl to image_url for API compatibility
  const apiEmployee: Record<string, any> = { ...employee };
  if ('imageUrl' in apiEmployee) {
    apiEmployee.image_url = apiEmployee.imageUrl;
    delete apiEmployee.imageUrl;
  }
  
  const response = await apiRequest<ApiResponse<Employee>, typeof apiEmployee>(
    ENDPOINT, 
    'POST', 
    apiEmployee
  );
  
  // Map image_url back to imageUrl for frontend compatibility
  if (response.data && response.data.image_url) {
    response.data.imageUrl = response.data.image_url;
  }
  
  return response;
};

/**
 * Update an existing employee
 * @param id Employee ID
 * @param employee Updated employee data
 * @returns Updated employee
 */
export const updateEmployee = async (
  id: string, 
  employee: Partial<Employee>
): Promise<ApiResponse<Employee>> => {
  // Convert imageUrl to image_url for API compatibility
  const apiEmployee: Record<string, any> = { ...employee };
  if ('imageUrl' in apiEmployee) {
    apiEmployee.image_url = apiEmployee.imageUrl;
    delete apiEmployee.imageUrl;
  }
  
  const response = await apiRequest<ApiResponse<Employee>, typeof apiEmployee>(
    `${ENDPOINT}/${id}`, 
    'PUT', 
    apiEmployee
  );
  
  // Map image_url back to imageUrl for frontend compatibility
  if (response.data && response.data.image_url) {
    response.data.imageUrl = response.data.image_url;
  }
  
  return response;
};

/**
 * Delete an employee
 * @param id Employee ID
 * @returns Success message
 */
export const deleteEmployee = async (
  id: string
): Promise<ApiResponse<{ message: string }>> => {
  return apiRequest<ApiResponse<{ message: string }>>(
    `${ENDPOINT}/${id}`, 
    'DELETE'
  );
};
