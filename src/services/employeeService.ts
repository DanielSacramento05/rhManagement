
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
  try {
    // Add a timestamp parameter to prevent caching
    const timestamp = new Date().getTime();
    const updatedFilters = { ...filters, _t: timestamp };
    
    const response = await apiRequest<PaginatedResponse<Employee>>(
      ENDPOINT, 
      'GET', 
      undefined, 
      buildQueryParams(updatedFilters)
    );
    
    // Map image_url to imageUrl for frontend compatibility for each employee
    if (response.data) {
      response.data = response.data.map(employee => {
        if (employee.image_url) {
          employee.imageUrl = employee.image_url;
        }
        
        // Add displayRole for frontend display purposes
        employee.displayRole = formatRoleForDisplay(employee.role || 'employee');
        
        return employee;
      });
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

/**
 * Get a specific employee by ID
 * @param id Employee ID
 * @returns Employee details
 */
export const getEmployeeById = async (
  id: string
): Promise<ApiResponse<Employee>> => {
  // Add a timestamp parameter to prevent caching
  const timestamp = new Date().getTime();
  const response = await apiRequest<ApiResponse<Employee>>(`${ENDPOINT}/${id}?_t=${timestamp}`);
  
  // Map image_url to imageUrl for frontend compatibility
  if (response.data && response.data.image_url) {
    response.data.imageUrl = response.data.image_url;
  }
  
  // Add displayRole for frontend display purposes
  if (response.data) {
    response.data.displayRole = formatRoleForDisplay(response.data.role || 'employee');
  }
  
  return response;
};

/**
 * Format role for display purposes
 */
export const formatRoleForDisplay = (role: string): string => {
  switch(role.toLowerCase()) {
    case 'admin':
      return 'Administrator';
    case 'manager':
      return 'Team Leader';
    case 'employee':
      return 'Employee';
    default:
      return role;
  }
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
  if (apiEmployee.imageUrl) {
    apiEmployee.image_url = apiEmployee.imageUrl;
    delete apiEmployee.imageUrl;
  }
  
  // Remove any display-only fields
  if ('displayRole' in apiEmployee) {
    delete apiEmployee.displayRole;
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
  
  // Add displayRole for frontend display purposes
  if (response.data) {
    response.data.displayRole = formatRoleForDisplay(response.data.role || 'employee');
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
  if (apiEmployee.imageUrl) {
    apiEmployee.image_url = apiEmployee.imageUrl;
    delete apiEmployee.imageUrl;
  }
  
  // Remove any display-only fields
  if ('displayRole' in apiEmployee) {
    delete apiEmployee.displayRole;
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
  
  // Add displayRole for frontend display purposes
  if (response.data) {
    response.data.displayRole = formatRoleForDisplay(response.data.role || 'employee');
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
