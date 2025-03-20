
import { apiRequest, buildQueryParams } from './api';
import { 
  Absence, 
  AbsenceFilters, 
  ApiResponse, 
  PaginatedResponse 
} from '@/types';

const ENDPOINT = '/absences';

/**
 * Get all absences with optional filtering and pagination
 * @param filters Filtering and pagination options
 * @returns Paginated list of absences
 */
export const getAbsences = async (
  filters?: AbsenceFilters
): Promise<PaginatedResponse<Absence>> => {
  return apiRequest<PaginatedResponse<Absence>>(
    ENDPOINT, 
    'GET', 
    undefined, 
    buildQueryParams(filters)
  );
};

/**
 * Get a specific absence by ID
 * @param id Absence ID
 * @returns Absence details
 */
export const getAbsenceById = async (
  id: string
): Promise<ApiResponse<Absence>> => {
  return apiRequest<ApiResponse<Absence>>(`${ENDPOINT}/${id}`);
};

/**
 * Create a new absence request
 * @param absence Absence data
 * @returns Created absence
 */
export const createAbsence = async (
  absence: Omit<Absence, 'id'>
): Promise<ApiResponse<Absence>> => {
  return apiRequest<ApiResponse<Absence>, Omit<Absence, 'id'>>(
    ENDPOINT, 
    'POST', 
    absence
  );
};

/**
 * Update an existing absence
 * @param id Absence ID
 * @param absence Updated absence data
 * @returns Updated absence
 */
export const updateAbsence = async (
  id: string, 
  absence: Partial<Absence>
): Promise<ApiResponse<Absence>> => {
  return apiRequest<ApiResponse<Absence>, Partial<Absence>>(
    `${ENDPOINT}/${id}`, 
    'PUT', 
    absence
  );
};

/**
 * Approve or decline an absence request
 * @param id Absence ID
 * @param status New status ('approved' or 'declined')
 * @param approvedBy ID of the employee who approved/declined
 * @returns Updated absence
 */
export const updateAbsenceStatus = async (
  id: string,
  status: 'approved' | 'declined',
  approvedBy: string
): Promise<ApiResponse<Absence>> => {
  return apiRequest<ApiResponse<Absence>, { status: string; approvedBy: string }>(
    `${ENDPOINT}/${id}/status`, 
    'PUT', 
    { status, approvedBy }
  );
};

/**
 * Delete an absence request
 * @param id Absence ID
 * @returns Success message
 */
export const deleteAbsence = async (
  id: string
): Promise<ApiResponse<{ message: string }>> => {
  return apiRequest<ApiResponse<{ message: string }>>(
    `${ENDPOINT}/${id}`, 
    'DELETE'
  );
};
