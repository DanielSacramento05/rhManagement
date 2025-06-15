
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
  filters?: AbsenceFilters & { excludeEmployeeId?: string }
): Promise<PaginatedResponse<Absence>> => {
  try {
    return await apiRequest<PaginatedResponse<Absence>>(
      ENDPOINT, 
      'GET', 
      undefined, 
      buildQueryParams(filters)
    );
  } catch (error) {
    console.error('Error fetching absences:', error);
    throw error;
  }
};

/**
 * Get a specific absence by ID
 * @param id Absence ID
 * @returns Absence details
 */
export const getAbsenceById = async (
  id: string
): Promise<ApiResponse<Absence>> => {
  try {
    return await apiRequest<ApiResponse<Absence>>(`${ENDPOINT}/${id}`);
  } catch (error) {
    console.error(`Error fetching absence ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new absence request
 * @param absence Absence data
 * @returns Created absence
 */
export const createAbsence = async (
  absence: Omit<Absence, 'id'> | any
): Promise<ApiResponse<Absence>> => {
  try {
    console.log('Creating absence with data:', absence);
    
    // Create a clean request object without any extra fields that might cause API errors
    const requestData = {
      employee_id: absence.employee_id,
      type: absence.type,
      status: absence.status,
      start_date: absence.start_date,
      end_date: absence.end_date,
      notes: absence.notes,
      approved_by: absence.approved_by
    };
    
    // Use the field names expected by the API
    return await apiRequest<ApiResponse<Absence>, any>(
      ENDPOINT, 
      'POST', 
      requestData
    );
  } catch (error) {
    console.error('Error creating absence:', error);
    throw error;
  }
};

/**
 * Update an existing absence
 * @param id Absence ID
 * @param absence Updated absence data
 * @returns Updated absence
 */
export const updateAbsence = async (
  id: string, 
  absence: Partial<Absence> | any
): Promise<ApiResponse<Absence>> => {
  try {
    return await apiRequest<ApiResponse<Absence>, any>(
      `${ENDPOINT}/${id}`, 
      'PUT', 
      absence
    );
  } catch (error) {
    console.error(`Error updating absence ${id}:`, error);
    throw error;
  }
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
  try {
    console.log(`Updating absence ${id} status to ${status} by ${approvedBy}`);
    
    // Format today's date as an ISO string (YYYY-MM-DD) to match the backend format
    // This helps ensure the backend can properly compare dates
    const today = new Date().toISOString().split('T')[0];
    console.log(`Current date for comparison: ${today}`);
    
    const response = await apiRequest<ApiResponse<Absence>, { status: string; approvedBy: string; currentDate: string }>(
      `${ENDPOINT}/${id}/status`, 
      'PUT', 
      { status, approvedBy, currentDate: today }
    );
    
    // After updating an absence status, refetch employees to get updated statuses
    // This is especially important when approving a leave that starts today
    // or when declining an absence that's currently active
    try {
      // We need to import these here to avoid circular dependencies
      const { getEmployees } = await import('./employeeService');
      await getEmployees();
    } catch (err) {
      console.error("Error refreshing employee data after absence status update:", err);
    }
    
    return response;
  } catch (error) {
    console.error(`Error updating absence status ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an absence request
 * @param id Absence ID
 * @returns Success message
 */
export const deleteAbsence = async (
  id: string
): Promise<ApiResponse<{ message: string }>> => {
  try {
    return await apiRequest<ApiResponse<{ message: string }>>(
      `${ENDPOINT}/${id}`, 
      'DELETE'
    );
  } catch (error) {
    console.error(`Error deleting absence ${id}:`, error);
    throw error;
  }
};
