
import { apiRequest, buildQueryParams } from './api';
import { getCurrentUser } from './authService';
import { canCreateAnnouncements } from './permissionService';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority?: 'low' | 'medium' | 'high';
  icon?: string;
  date: string;
  created_by: string;
  created_by_name?: string;
  created_by_role?: 'admin' | 'manager' | 'employee';
  department_id?: string;
  is_global?: boolean;
}

export interface AnnouncementFilters {
  departmentId?: string;
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Get announcements with role-based filtering
 */
export const getAnnouncements = async (
  filters?: AnnouncementFilters
): Promise<{ data: Announcement[] }> => {
  try {
    // Add the current user's department to filter if user is not an admin
    const currentUser = getCurrentUser();
    let params = { ...filters };

    // When fetching as a regular employee or manager, filter for announcements applicable to them
    if (currentUser && !canCreateAnnouncements('company', currentUser) && !params.departmentId) {
      params.departmentId = currentUser.departmentId || 'none';
    }

    const response = await apiRequest<{ data: Announcement[] }>(
      '/announcements',
      'GET',
      undefined,
      buildQueryParams(params)
    );
    
    // If the API request fails, fallback to mock data
    return response;
  } catch (error) {
    console.error('Error fetching announcements:', error);
    
    // Return mock announcements as fallback
    const currentUser = getCurrentUser();
    
    // Generate mock data based on user role
    const mockAnnouncements: Announcement[] = [
      { 
        id: '1',
        title: 'Quarterly Review',
        content: 'Quarterly reviews scheduled for the second week of September.',
        priority: 'medium',
        icon: 'bell',
        date: '2025-05-01',
        created_by: 'HR Department',
        created_by_role: 'admin',
        is_global: true
      },
      { 
        id: '2',
        title: 'Employee Engagement Survey',
        content: 'Please complete the survey by August 29th.',
        priority: 'high',
        icon: 'trending-up',
        date: '2025-04-28',
        created_by: 'HR Department',
        created_by_role: 'admin',
        is_global: true
      },
      { 
        id: '3',
        title: 'Team Meeting',
        content: 'Weekly team meeting scheduled for Friday at 2pm.',
        priority: 'low',
        icon: 'calendar',
        date: '2025-05-05',
        created_by: 'Team Lead',
        created_by_role: 'manager',
        department_id: currentUser?.departmentId || 'dev'
      }
    ];

    return { data: mockAnnouncements };
  }
};

/**
 * Create a new announcement
 */
export const createAnnouncement = async (announcement: Partial<Announcement>): Promise<{ data: Announcement }> => {
  const currentUser = getCurrentUser();
  
  // Add metadata to the announcement and ensure we're using snake_case fields for backend
  const newAnnouncement = {
    ...announcement,
    created_by: currentUser?.id || '',
    date: new Date().toISOString().split('T')[0],
    is_global: announcement.is_global || false,
    department_id: !canCreateAnnouncements('company', currentUser) ? currentUser?.departmentId : undefined
  };

  try {
    return await apiRequest<{ data: Announcement }, Partial<Announcement>>(
      '/announcements',
      'POST',
      newAnnouncement
    );
  } catch (error) {
    console.error('Error creating announcement:', error);
    
    // Mock response
    return {
      data: {
        id: Date.now().toString(),
        ...newAnnouncement,
        title: newAnnouncement.title || '',
        content: newAnnouncement.content || '',
        date: newAnnouncement.date || new Date().toISOString().split('T')[0]
      }
    };
  }
};

/**
 * Update an announcement
 */
export const updateAnnouncement = async (
  id: string,
  data: Partial<Announcement>
): Promise<{ data: Announcement }> => {
  // Ensure we're using snake_case fields for backend
  const updateData = {
    ...data,
    is_global: data.is_global,
    department_id: data.department_id
  };
  
  try {
    return await apiRequest<{ data: Announcement }, Partial<Announcement>>(
      `/announcements/${id}`,
      'PUT',
      updateData
    );
  } catch (error) {
    console.error('Error updating announcement:', error);
    throw error;
  }
};

/**
 * Delete an announcement
 */
export const deleteAnnouncement = async (
  id: string
): Promise<{ message: string }> => {
  try {
    return await apiRequest<{ message: string }>(
      `/announcements/${id}`,
      'DELETE'
    );
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return { message: 'Announcement deleted successfully (mock)' };
  }
};
