
import { apiRequest, buildQueryParams } from './api';
import { 
  PerformanceReview, 
  PerformanceGoal,
  SkillAssessment,
  PerformanceFilters, 
  ApiResponse, 
  PaginatedResponse 
} from '@/types';

const REVIEWS_ENDPOINT = '/performance/reviews';
const GOALS_ENDPOINT = '/performance/goals';
const SKILLS_ENDPOINT = '/performance/skills';

/**
 * Get all performance reviews with optional filtering and pagination
 * @param filters Filtering and pagination options
 * @returns Paginated list of performance reviews
 */
export const getPerformanceReviews = async (
  filters?: PerformanceFilters
): Promise<PaginatedResponse<PerformanceReview>> => {
  return apiRequest<PaginatedResponse<PerformanceReview>>(
    REVIEWS_ENDPOINT, 
    'GET', 
    undefined, 
    buildQueryParams(filters)
  );
};

/**
 * Get a specific performance review by ID
 * @param id Review ID
 * @returns Performance review details
 */
export const getPerformanceReviewById = async (
  id: string
): Promise<ApiResponse<PerformanceReview>> => {
  return apiRequest<ApiResponse<PerformanceReview>>(`${REVIEWS_ENDPOINT}/${id}`);
};

/**
 * Create a new performance review
 * @param review Performance review data
 * @returns Created performance review
 */
export const createPerformanceReview = async (
  review: Omit<PerformanceReview, 'id'>
): Promise<ApiResponse<PerformanceReview>> => {
  return apiRequest<ApiResponse<PerformanceReview>, Omit<PerformanceReview, 'id'>>(
    REVIEWS_ENDPOINT, 
    'POST', 
    review
  );
};

/**
 * Update an existing performance review
 * @param id Review ID
 * @param review Updated performance review data
 * @returns Updated performance review
 */
export const updatePerformanceReview = async (
  id: string, 
  review: Partial<PerformanceReview>
): Promise<ApiResponse<PerformanceReview>> => {
  return apiRequest<ApiResponse<PerformanceReview>, Partial<PerformanceReview>>(
    `${REVIEWS_ENDPOINT}/${id}`, 
    'PUT', 
    review
  );
};

/**
 * Delete a performance review
 * @param id Review ID
 * @returns Success message
 */
export const deletePerformanceReview = async (
  id: string
): Promise<ApiResponse<{ message: string }>> => {
  return apiRequest<ApiResponse<{ message: string }>>(
    `${REVIEWS_ENDPOINT}/${id}`, 
    'DELETE'
  );
};

/**
 * Get performance goals for an employee
 * @param employeeId Employee ID
 * @returns List of performance goals
 */
export const getPerformanceGoals = async (
  employeeId?: string
): Promise<ApiResponse<PerformanceGoal[]>> => {
  return apiRequest<ApiResponse<PerformanceGoal[]>>(
    GOALS_ENDPOINT, 
    'GET', 
    undefined, 
    employeeId ? { employeeId } : undefined
  );
};

/**
 * Create a new performance goal
 * @param goal Performance goal data
 * @returns Created performance goal
 */
export const createPerformanceGoal = async (
  goal: Omit<PerformanceGoal, 'id'>
): Promise<ApiResponse<PerformanceGoal>> => {
  return apiRequest<ApiResponse<PerformanceGoal>, Omit<PerformanceGoal, 'id'>>(
    GOALS_ENDPOINT, 
    'POST', 
    goal
  );
};

/**
 * Update an existing performance goal
 * @param id Goal ID
 * @param goal Updated performance goal data
 * @returns Updated performance goal
 */
export const updatePerformanceGoal = async (
  id: string, 
  goal: Partial<PerformanceGoal>
): Promise<ApiResponse<PerformanceGoal>> => {
  return apiRequest<ApiResponse<PerformanceGoal>, Partial<PerformanceGoal>>(
    `${GOALS_ENDPOINT}/${id}`, 
    'PUT', 
    goal
  );
};

/**
 * Get skill assessments for an employee
 * @param employeeId Employee ID
 * @returns List of skill assessments
 */
export const getSkillAssessments = async (
  employeeId?: string
): Promise<ApiResponse<SkillAssessment[]>> => {
  return apiRequest<ApiResponse<SkillAssessment[]>>(
    SKILLS_ENDPOINT, 
    'GET', 
    undefined, 
    employeeId ? { employeeId } : undefined
  );
};

/**
 * Create or update skill assessments
 * @param skills Array of skill assessment data
 * @returns Created/updated skill assessments
 */
export const saveSkillAssessments = async (
  skills: (Omit<SkillAssessment, 'id'> | SkillAssessment)[]
): Promise<ApiResponse<SkillAssessment[]>> => {
  return apiRequest<ApiResponse<SkillAssessment[]>, (Omit<SkillAssessment, 'id'> | SkillAssessment)[]>(
    SKILLS_ENDPOINT, 
    'POST', 
    skills
  );
};
