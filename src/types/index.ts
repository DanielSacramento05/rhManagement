
// Re-export auth types
export * from './auth';

// Employee types
export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  status: 'active' | 'on-leave' | 'remote' | 'inactive' | 'out-of-office';
  imageUrl?: string;
  image_url?: string; // Adding this to match the API response structure
  hireDate?: string;
  managerId?: string;
  role?: 'hr_admin' | 'dept_manager' | 'employee' | 'system_admin';
  displayRole?: string; // Added for display purposes
}

// Department types
export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
}

// Absence types
export interface Absence {
  id?: string;
  employee_id?: string;
  employeeId?: string;
  employeeName?: string; // For display purposes, not stored in DB
  department?: string; // For display purposes, not stored in DB
  position?: string; // For display purposes, not stored in DB
  type: 'Vacation' | 'Sick Leave' | 'Personal' | 'Training';
  status: 'pending' | 'approved' | 'declined';
  start_date?: string; // ISO date string
  startDate?: string; // ISO date string
  end_date?: string; // ISO date string
  endDate?: string; // ISO date string
  notes?: string;
  approvedBy?: string;
  requestDate?: string; // ISO date string for when the request was made
  createdAt?: string; // ISO date string
  imageUrl?: string; // For display purposes, not stored in DB
}

// TimeClock types
export interface TimeClockEntry {
  id: string;
  employeeId: string;
  date: string;
  clockInTime: string;
  clockOutTime: string | null;
  totalHours: number | null;
  status: 'active' | 'completed';
}

// Performance types
export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName?: string; // For display purposes, not stored in DB
  department?: string; // For display purposes, not stored in DB
  position?: string; // For display purposes, not stored in DB
  reviewDate: string; // ISO date string
  reviewType: 'Quarterly' | 'Semi-Annual' | 'Annual';
  overallScore: number;
  lastReviewDate?: string; // ISO date string
  nextReviewDate?: string; // ISO date string
  notes?: string;
  reviewerId?: string;
  imageUrl?: string; // For display purposes, not stored in DB
}

export interface PerformanceGoal {
  id: string;
  employeeId: string;
  title: string;
  description?: string;
  progress: number; // 0-100
  status: 'not-started' | 'in-progress' | 'completed';
  dueDate?: string; // ISO date string
  reviewId?: string;
}

export interface SkillAssessment {
  id: string;
  employeeId: string;
  name: string;
  score: number; // 0-100
  reviewId?: string;
}

// Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

// Request types
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface EmployeeFilters extends PaginationParams {
  department?: string;
  status?: string;
  search?: string;
}

export interface AbsenceFilters extends PaginationParams {
  employeeId?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface TimeClockFilters extends PaginationParams {
  employeeId?: string;
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  status?: 'active' | 'completed';
}

export interface PerformanceFilters extends PaginationParams {
  employeeId?: string;
  department?: string;
  reviewType?: string;
  minScore?: number;
  maxScore?: number;
}
