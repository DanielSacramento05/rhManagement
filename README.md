
# HR Management System

## Project Overview

A comprehensive human resources management system that enables organizations to efficiently manage employee data, track attendance, handle absences, and monitor performance metrics.

## Technologies Used

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Flask (Backend)

## Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Local Development

```sh
# Step 1: Clone the repository
git clone <REPOSITORY_URL>

# Step 2: Navigate to the project directory
cd hr-management-system

# Step 3: Install dependencies
npm i

# Step 4: Start the development server
npm run dev
```

### Project Structure

- `/src`: Contains all frontend source code
  - `/components`: Reusable UI components
  - `/hooks`: Custom React hooks
  - `/pages`: Main application pages/routes
  - `/services`: API services and data fetching
  - `/types`: TypeScript type definitions

- `/api`: Backend API server (Flask)
  - `/routes`: API route definitions
  - `/models.py`: Database models

## Features

- Employee management
- Time tracking and attendance
- Absence management
- Performance reviews
- Dashboard with analytics
