
import { apiRequest, buildQueryParams } from './api';
import { 
  Employee, 
  EmployeeFilters, 
  ApiResponse, 
  PaginatedResponse 
} from '@/types';
import { getCurrentUser } from './authService';

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
    const currentUser = getCurrentUser();
    let updatedFilters = { ...filters };
    
    // If user is a department manager, only show employees from their department
    if (currentUser?.role === 'dept_manager' && currentUser.departmentName) {
      updatedFilters.department = currentUser.departmentName;
    }
    
    // Add a timestamp parameter to prevent caching - extend the filters type
    const timestamp = new Date().getTime();
    const filtersWithTimestamp = { ...updatedFilters, _t: timestamp } as any;
    
    const response = await apiRequest<PaginatedResponse<Employee>>(
      ENDPOINT, 
      'GET', 
      undefined, 
      buildQueryParams(filtersWithTimestamp)
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
    case 'hr_admin':
      return 'HR Administrator';
    case 'dept_manager':
      return 'Department Manager';
    case 'system_admin':
      return 'System Administrator';
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
  // Convert frontend fields to API fields
  const apiEmployee: Record<string, any> = { ...employee };
  
  // Map imageUrl to image_url for API compatibility
  if (apiEmployee.imageUrl) {
    apiEmployee.image_url = apiEmployee.imageUrl;
    delete apiEmployee.imageUrl;
  }
  
  // Map hireDate to hire_date for API compatibility
  if (apiEmployee.hireDate) {
    apiEmployee.hire_date = apiEmployee.hireDate;
    delete apiEmployee.hireDate;
  }
  
  // Map managerId to manager_id for API compatibility
  if (apiEmployee.managerId) {
    apiEmployee.manager_id = apiEmployee.managerId;
    delete apiEmployee.managerId;
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
  
  // Map API fields back to frontend fields
  if (response.data) {
    if (response.data.image_url) {
      response.data.imageUrl = response.data.image_url;
    }
    
    // Add displayRole for frontend display purposes
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
  // Convert frontend fields to API fields
  const apiEmployee: Record<string, any> = { ...employee };
  
  // Map imageUrl to image_url for API compatibility
  if (apiEmployee.imageUrl) {
    apiEmployee.image_url = apiEmployee.imageUrl;
    delete apiEmployee.imageUrl;
  }
  
  // Map hireDate to hire_date for API compatibility
  if (apiEmployee.hireDate) {
    apiEmployee.hire_date = apiEmployee.hireDate;
    delete apiEmployee.hireDate;
  }
  
  // Map managerId to manager_id for API compatibility
  if (apiEmployee.managerId) {
    apiEmployee.manager_id = apiEmployee.managerId;
    delete apiEmployee.managerId;
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
  
  // Map API fields back to frontend fields
  if (response.data) {
    if (response.data.image_url) {
      response.data.imageUrl = response.data.image_url;
    }
    
    // Add displayRole for frontend display purposes
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

/**
 * Update employee role
 * @param id Employee ID
 * @param role New role
 * @returns Updated employee
 */
export const updateEmployeeRole = async (
  id: string,
  role: 'hr_admin' | 'dept_manager' | 'employee' | 'system_admin'
): Promise<ApiResponse<Employee>> => {
  const response = await apiRequest<ApiResponse<Employee>, { role: string }>(
    `${ENDPOINT}/${id}/role`,
    'PUT',
    { role }
  );
  
  // Map API fields back to frontend fields
  if (response.data) {
    if (response.data.image_url) {
      response.data.imageUrl = response.data.image_url;
    }
    
    // Add displayRole for frontend display purposes
    response.data.displayRole = formatRoleForDisplay(response.data.role || 'employee');
  }
  
  return response;
};
