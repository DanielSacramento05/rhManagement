from app import app
from models import db, Employee, Department, Absence, PerformanceReview, PerformanceGoal, SkillAssessment
import uuid
from datetime import datetime, timedelta, date
from werkzeug.security import generate_password_hash

def seed_database():
    with app.app_context():
        # Clear existing data
        print("Clearing existing data...")
        SkillAssessment.query.delete()
        PerformanceGoal.query.delete()
        PerformanceReview.query.delete()
        Absence.query.delete()
        Employee.query.delete()
        Department.query.delete()
        db.session.commit()
        
        # Create departments
        print("Creating departments...")
        departments = [
            Department(
                id=str(uuid.uuid4()),
                name='Human Resources',
                description='Manages employee relations and hiring processes'
            ),
            Department(
                id=str(uuid.uuid4()),
                name='Information Technology',
                description='Maintains IT infrastructure and develops software solutions'
            ),
            Department(
                id=str(uuid.uuid4()),
                name='Finance',
                description='Handles company financial operations and reporting'
            ),
            Department(
                id=str(uuid.uuid4()),
                name='Marketing',
                description='Promotes company products and services'
            ),
            Department(
                id=str(uuid.uuid4()),
                name='Operations',
                description='Oversees day-to-day business operations'
            )
        ]
        
        db.session.add_all(departments)
        db.session.commit()
        
        # Create employees
        print("Creating employees...")
        employees = []
        
        # Create a manager for each department
        managers = []
        for i, dept in enumerate(departments):
            manager_id = str(uuid.uuid4())
            manager = Employee(
                id=manager_id,
                name=f'Manager {i+1}',
                position=f'{dept.name} Manager',
                department=dept.name,
                email=f'manager{i+1}@example.com',
                phone=f'555-{100+i}',
                status='active',
                image_url=f'https://randomuser.me/api/portraits/men/{i+10}.jpg',
                hire_date=date(2018, 1, 15) - timedelta(days=i*30),
                # Add password hash
                password_hash=generate_password_hash('manager123')
            )
            managers.append(manager)
            employees.append(manager)
            
            # Update department with manager
            dept.manager_id = manager_id
        
        # Create admin user
        admin = Employee(
            id=str(uuid.uuid4()),
            name='Admin User',
            position='System Administrator',
            department='Information Technology',
            email='admin@example.com',
            phone='555-000',
            status='active',
            image_url='https://randomuser.me/api/portraits/men/1.jpg',
            hire_date=date(2017, 1, 1),
            password_hash=generate_password_hash('admin123')
        )
        employees.append(admin)
        
        # Create regular employees
        statuses = ['active', 'remote', 'on-leave']
        for i in range(20):
            dept_index = i % len(departments)
            status_index = i % len(statuses)
            
            employee = Employee(
                id=str(uuid.uuid4()),
                name=f'Employee {i+1}',
                position=f'{departments[dept_index].name} Specialist',
                department=departments[dept_index].name,
                email=f'employee{i+1}@example.com',
                phone=f'555-{200+i}',
                status=statuses[status_index],
                image_url=f'https://randomuser.me/api/portraits/{'women' if i%2 else 'men'}/{i+30}.jpg',
                hire_date=date(2020, 1, 15) - timedelta(days=i*20),
                manager_id=managers[dept_index].id,
                # Add password hash for demo
                password_hash=generate_password_hash('employee123')
            )
            employees.append(employee)
        
        db.session.add_all(employees)
        db.session.commit()
        
        # Create absences
        print("Creating absences...")
        absence_types = ['Vacation', 'Sick Leave', 'Personal', 'Training']
        statuses = ['pending', 'approved', 'declined']
        
        absences = []
        for i, employee in enumerate(employees[5:]):  # Skip managers for absences
            type_index = i % len(absence_types)
            status_index = i % len(statuses)
            
            # Current request
            absence = Absence(
                id=str(uuid.uuid4()),
                employee_id=employee.id,
                type=absence_types[type_index],
                status=statuses[status_index],
                start_date=date.today() + timedelta(days=i),
                end_date=date.today() + timedelta(days=i+5),
                notes=f'Absence notes for {employee.name}',
                approved_by=managers[0].id if statuses[status_index] != 'pending' else None,
                request_date=datetime.now() - timedelta(days=10)
            )
            absences.append(absence)
            
            # Past request
            past_absence = Absence(
                id=str(uuid.uuid4()),
                employee_id=employee.id,
                type=absence_types[(type_index + 1) % len(absence_types)],
                status='approved',
                start_date=date.today() - timedelta(days=30+i),
                end_date=date.today() - timedelta(days=25+i),
                notes=f'Past absence for {employee.name}',
                approved_by=managers[0].id,
                request_date=datetime.now() - timedelta(days=45)
            )
            absences.append(past_absence)
        
        db.session.add_all(absences)
        db.session.commit()
        
        # Create performance reviews
        print("Creating performance reviews...")
        review_types = ['Quarterly', 'Semi-Annual', 'Annual']
        
        reviews = []
        for i, employee in enumerate(employees):
            review_type_index = i % len(review_types)
            score = 60 + (i % 40)  # Scores between 60-99
            
            review = PerformanceReview(
                id=str(uuid.uuid4()),
                employee_id=employee.id,
                review_date=date.today() - timedelta(days=i*15),
                review_type=review_types[review_type_index],
                overall_score=score,
                last_review_date=date.today() - timedelta(days=(i*15) + 90),
                next_review_date=date.today() + timedelta(days=90 - i*5),
                notes=f'Performance notes for {employee.name}',
                reviewer_id=managers[0].id
            )
            reviews.append(review)
        
        db.session.add_all(reviews)
        db.session.commit()
        
        # Create performance goals
        print("Creating performance goals...")
        goal_statuses = ['not-started', 'in-progress', 'completed']
        
        goals = []
        for i, employee in enumerate(employees):
            status_index = i % len(goal_statuses)
            progress = 100 if goal_statuses[status_index] == 'completed' else (
                0 if goal_statuses[status_index] == 'not-started' else 50
            )
            
            for j in range(3):  # 3 goals per employee
                goal = PerformanceGoal(
                    id=str(uuid.uuid4()),
                    employee_id=employee.id,
                    title=f'Goal {j+1} for {employee.name}',
                    description=f'Detailed description for goal {j+1}',
                    progress=progress,
                    status=goal_statuses[status_index],
                    due_date=date.today() + timedelta(days=30 + j*15),
                    review_id=reviews[i].id
                )
                goals.append(goal)
        
        db.session.add_all(goals)
        db.session.commit()
        
        # Create skill assessments
        print("Creating skill assessments...")
        skills = ['Communication', 'Teamwork', 'Problem Solving', 'Technical Knowledge', 'Leadership']
        
        skill_assessments = []
        for i, employee in enumerate(employees):
            for j, skill in enumerate(skills):
                score = 60 + ((i + j) % 40)  # Scores between 60-99
                
                assessment = SkillAssessment(
                    id=str(uuid.uuid4()),
                    employee_id=employee.id,
                    name=skill,
                    score=score,
                    review_id=reviews[i].id
                )
                skill_assessments.append(assessment)
        
        db.session.add_all(skill_assessments)
        db.session.commit()
        
        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_database()
