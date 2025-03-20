
# HR Management API

This is the backend API for the HR Management application, built with Flask, SQLAlchemy, and MySQL.

## Setup Instructions

1. Clone the repository
2. Create a virtual environment:
   ```
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
5. Create a `.env` file based on `.env.example` with your database credentials
6. Create a MySQL database:
   ```sql
   CREATE DATABASE hr_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
7. Run the application:
   ```
   flask run
   ```

## API Endpoints

The API provides the following endpoints that match the frontend expectations:

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

## Development

### Database Migrations

This project doesn't include migrations by default. If you need to make database schema changes, consider adding Flask-Migrate to the project.

### Populating Test Data

You can create a script to populate test data for development:

```python
# seed.py
from app import app
from models import db, Employee, Department, Absence, PerformanceReview
import uuid
from datetime import datetime, timedelta

with app.app_context():
    # Create departments
    hr = Department(id=str(uuid.uuid4()), name='Human Resources', description='HR department')
    it = Department(id=str(uuid.uuid4()), name='IT', description='Information Technology')
    
    db.session.add(hr)
    db.session.add(it)
    db.session.commit()
    
    # Create employees
    # ... add your test data here
```

Run with: `python seed.py`
