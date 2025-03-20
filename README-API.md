
# HR Management API Integration Guide

This document outlines how to integrate the HR Management application with a backend API.

## Database Schema

The application requires the following data entities to be stored in your database:

### 1. Employees
- `id` (unique identifier)
- `name` (full name)
- `position` (job title)
- `department` (which department they belong to)
- `email` (contact email)
- `phone` (contact phone number)
- `status` ('active', 'remote', 'on-leave')
- `imageUrl` (profile picture URL)
- `hireDate` (when they were hired)
- `managerId` (reference to another employee)

### 2. Departments
- `id` (unique identifier)
- `name` (department name)
- `description` (brief description)
- `managerId` (reference to head of department)

### 3. Absences/Leave Requests
- `id` (unique identifier)
- `employeeId` (reference to employee)
- `type` ('Vacation', 'Sick Leave', 'Personal', 'Training')
- `status` ('pending', 'approved', 'declined')
- `startDate` (first day of absence)
- `endDate` (last day of absence)
- `notes` (reason or additional information)
- `approvedBy` (reference to employee who approved)
- `requestDate` (when the request was made)

### 4. Performance Reviews
- `id` (unique identifier)
- `employeeId` (reference to employee)
- `reviewDate` (when the review occurred/is scheduled)
- `reviewType` ('Quarterly', 'Semi-Annual', 'Annual')
- `overallScore` (numerical rating)
- `notes` (general feedback)
- `reviewerId` (who conducted the review)
- `nextReviewDate` (when next review is due)

### 5. Performance Goals
- `id` (unique identifier)
- `employeeId` (reference to employee)
- `title` (name of the goal)
- `description` (details of what to achieve)
- `progress` (percentage complete)
- `status` ('not-started', 'in-progress', 'completed')
- `dueDate` (target completion date)
- `reviewId` (associated review if applicable)

### 6. Skills Assessment
- `id` (unique identifier)
- `employeeId` (reference to employee)
- `name` (name of skill)
- `score` (assessment score)
- `reviewId` (associated review)

## API Endpoints

The frontend expects the following API endpoints:

### Employees
- `GET /api/employees` - List all employees (with filters)
- `GET /api/employees/:id` - Get specific employee
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Departments
- `GET /api/departments` - List all departments
- `GET /api/departments/:id` - Get specific department
- `POST /api/departments` - Create new department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Absences
- `GET /api/absences` - List all absences (with filters)
- `GET /api/absences/:id` - Get specific absence
- `POST /api/absences` - Create new absence request
- `PUT /api/absences/:id` - Update absence
- `PUT /api/absences/:id/status` - Update absence status
- `DELETE /api/absences/:id` - Delete absence

### Performance
- `GET /api/performance/reviews` - List all performance reviews (with filters)
- `GET /api/performance/reviews/:id` - Get specific review
- `POST /api/performance/reviews` - Create new review
- `PUT /api/performance/reviews/:id` - Update review
- `DELETE /api/performance/reviews/:id` - Delete review
- `GET /api/performance/goals` - Get goals (with employee filter)
- `POST /api/performance/goals` - Create new goal
- `PUT /api/performance/goals/:id` - Update goal
- `GET /api/performance/skills` - Get skills (with employee filter)
- `POST /api/performance/skills` - Create/update skills

## Response Format

All API responses should follow this format:

```json
{
  "data": {}, // The actual response data
  "error": "" // Optional error message
}
```

For paginated responses:

```json
{
  "data": [], // Array of items
  "totalCount": 100, // Total number of items
  "page": 1, // Current page
  "pageSize": 10 // Items per page
}
```

## Environment Variables

Create a `.env` file based on `.env.example` with your API URL:

```
VITE_API_BASE_URL=http://your-api-server.com/api
```

## Implementation

The frontend application uses the following service files to communicate with the API:

- `src/services/api.ts` - Base API configuration
- `src/services/employeeService.ts` - Employee-related requests
- `src/services/departmentService.ts` - Department-related requests
- `src/services/absenceService.ts` - Absence-related requests
- `src/services/performanceService.ts` - Performance-related requests

These files contain TypeScript interfaces that document the expected data structures.

## Data Types

All date fields should be provided as ISO string format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ).

All IDs should be unique strings (UUIDs are recommended).

Status fields like `status` in Employee or Absence must match the expected string literals as defined in the TypeScript interfaces.
