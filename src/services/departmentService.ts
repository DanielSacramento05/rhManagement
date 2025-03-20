
import { apiRequest, buildQueryParams } from './api';
import { 
  Department, 
  PaginationParams,
  ApiResponse, 
  PaginatedResponse 
} from '@/types';

const ENDPOINT = '/departments';

/**
 * Get all departments with optional pagination
 * @param params Pagination options
 * @returns Paginated list of departments
 */
export const getDepartments = async (
  params?: PaginationParams
): Promise<PaginatedResponse<Department>> => {
  return apiRequest<PaginatedResponse<Department>>(
    ENDPOINT, 
    'GET', 
    undefined, 
    buildQueryParams(params)
  );
};

/**
 * Get a specific department by ID
 * @param id Department ID
 * @returns Department details
 */
export const getDepartmentById = async (
  id: string
): Promise<ApiResponse<Department>> => {
  return apiRequest<ApiResponse<Department>>(`${ENDPOINT}/${id}`);
};

/**
 * Create a new department
 * @param department Department data
 * @returns Created department
 */
export const createDepartment = async (
  department: Omit<Department, 'id'>
): Promise<ApiResponse<Department>> => {
  return apiRequest<ApiResponse<Department>, Omit<Department, 'id'>>(
    ENDPOINT, 
    'POST', 
    department
  );
};

/**
 * Update an existing department
 * @param id Department ID
 * @param department Updated department data
 * @returns Updated department
 */
export const updateDepartment = async (
  id: string, 
  department: Partial<Department>
): Promise<ApiResponse<Department>> => {
  return apiRequest<ApiResponse<Department>, Partial<Department>>(
    `${ENDPOINT}/${id}`, 
    'PUT', 
    department
  );
};

/**
 * Delete a department
 * @param id Department ID
 * @returns Success message
 */
export const deleteDepartment = async (
  id: string
): Promise<ApiResponse<{ message: string }>> => {
  return apiRequest<ApiResponse<{ message: string }>>(
    `${ENDPOINT}/${id}`, 
    'DELETE'
  );
};
