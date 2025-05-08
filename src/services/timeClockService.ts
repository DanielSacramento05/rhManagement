
import { apiRequest, buildQueryParams } from './api';
import { ApiResponse, PaginatedResponse } from '@/types';
import { format } from 'date-fns';

export interface TimeClockEntry {
  id: string;
  employeeId: string;
  clockInTime: string;
  clockOutTime: string | null;
  date: string;
  totalHours: number | null;
  status: 'active' | 'completed';
}

export interface TimeClockFilters {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  status?: 'active' | 'completed';
  page?: number;
  pageSize?: number;
}

const ENDPOINT = '/time-clock';

// Custom error handler for time clock operations
const handleTimeClockError = (error: any, operation: string) => {
  console.error(`Error during time clock operation (${operation}):`, error);
  
  // Check for specific time clock errors
  if (error.message.includes('already clocked in')) {
    throw new Error('This employee is already clocked in. Please clock out first.');
  }
  
  if (error.message.includes('No active time clock entry found')) {
    throw new Error('No active time clock found. The employee must clock in first.');
  }
  
  if (error.message.includes('on leave')) {
    throw new Error('Cannot perform this operation. Employee is currently on leave.');
  }
  
  // Forward the original error if it's not a specific case we handle
  throw error;
};

/**
 * Get time clock entries with optional filtering
 */
export const getTimeClockEntries = async (
  filters?: TimeClockFilters
): Promise<PaginatedResponse<TimeClockEntry>> => {
  try {
    const response = await apiRequest<PaginatedResponse<TimeClockEntry>>(
      ENDPOINT,
      'GET',
      undefined,
      buildQueryParams(filters)
    );
    console.log('Time clock entries response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching time clock entries:', error);
    throw error;
  }
};

/**
 * Get an employee's current active time clock entry
 */
export const getActiveTimeClockEntry = async (
  employeeId: string
): Promise<ApiResponse<TimeClockEntry | null>> => {
  try {
    return await apiRequest<ApiResponse<TimeClockEntry | null>>(
      `${ENDPOINT}/active/${employeeId}`
    );
  } catch (error) {
    console.error(`Error fetching active time clock entry for ${employeeId}:`, error);
    throw error;
  }
};

/**
 * Clock in an employee
 */
export const clockIn = async (
  employeeId: string
): Promise<ApiResponse<TimeClockEntry>> => {
  try {
    return await apiRequest<ApiResponse<TimeClockEntry>, { employeeId: string }>(
      `${ENDPOINT}/clock-in`,
      'POST',
      { employeeId }
    );
  } catch (error) {
    return handleTimeClockError(error, 'clock-in');
  }
};

/**
 * Clock out an employee
 */
export const clockOut = async (
  employeeId: string
): Promise<ApiResponse<TimeClockEntry>> => {
  try {
    return await apiRequest<ApiResponse<TimeClockEntry>, { employeeId: string }>(
      `${ENDPOINT}/clock-out`,
      'POST',
      { employeeId }
    );
  } catch (error) {
    return handleTimeClockError(error, 'clock-out');
  }
};

/**
 * Update a time clock entry
 */
export const updateTimeClockEntry = async (
  id: string,
  data: Partial<TimeClockEntry>
): Promise<ApiResponse<TimeClockEntry>> => {
  try {
    return await apiRequest<ApiResponse<TimeClockEntry>, Partial<TimeClockEntry>>(
      `${ENDPOINT}/${id}`,
      'PUT',
      data
    );
  } catch (error) {
    console.error('Error updating time clock entry:', error);
    throw new Error(`Failed to update time clock entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Delete a time clock entry
 */
export const deleteTimeClockEntry = async (
  id: string
): Promise<ApiResponse<{message: string}>> => {
  try {
    return await apiRequest<ApiResponse<{message: string}>>(
      `${ENDPOINT}/${id}`,
      'DELETE'
    );
  } catch (error) {
    console.error('Error deleting time clock entry:', error);
    throw new Error(`Failed to delete time clock entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
