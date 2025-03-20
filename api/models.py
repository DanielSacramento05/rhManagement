
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Employee(db.Model):
    __tablename__ = 'employees'
    
    id = db.Column(db.String(36), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    phone = db.Column(db.String(20), nullable=False)
    status = db.Column(db.Enum('active', 'on-leave', 'remote'), default='active')
    image_url = db.Column(db.String(255))
    hire_date = db.Column(db.Date)
    manager_id = db.Column(db.String(36), db.ForeignKey('employees.id'), nullable=True)
    
    # Relationships
    manager = db.relationship('Employee', remote_side=[id], backref='subordinates')
    absences = db.relationship('Absence', backref='employee', cascade='all, delete-orphan')
    performance_reviews = db.relationship('PerformanceReview', backref='employee', cascade='all, delete-orphan')
    performance_goals = db.relationship('PerformanceGoal', backref='employee', cascade='all, delete-orphan')
    skill_assessments = db.relationship('SkillAssessment', backref='employee', cascade='all, delete-orphan')

class Department(db.Model):
    __tablename__ = 'departments'
    
    id = db.Column(db.String(36), primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)
    manager_id = db.Column(db.String(36), db.ForeignKey('employees.id'), nullable=True)
    
    # Relationships
    manager = db.relationship('Employee', backref='managed_departments')

class Absence(db.Model):
    __tablename__ = 'absences'
    
    id = db.Column(db.String(36), primary_key=True)
    employee_id = db.Column(db.String(36), db.ForeignKey('employees.id'), nullable=False)
    type = db.Column(db.Enum('Vacation', 'Sick Leave', 'Personal', 'Training'), nullable=False)
    status = db.Column(db.Enum('pending', 'approved', 'declined'), default='pending')
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    notes = db.Column(db.Text)
    approved_by = db.Column(db.String(36), db.ForeignKey('employees.id'), nullable=True)
    request_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    approver = db.relationship('Employee', foreign_keys=[approved_by])

class PerformanceReview(db.Model):
    __tablename__ = 'performance_reviews'
    
    id = db.Column(db.String(36), primary_key=True)
    employee_id = db.Column(db.String(36), db.ForeignKey('employees.id'), nullable=False)
    review_date = db.Column(db.Date, nullable=False)
    review_type = db.Column(db.Enum('Quarterly', 'Semi-Annual', 'Annual'), nullable=False)
    overall_score = db.Column(db.Integer, nullable=False)
    last_review_date = db.Column(db.Date)
    next_review_date = db.Column(db.Date)
    notes = db.Column(db.Text)
    reviewer_id = db.Column(db.String(36), db.ForeignKey('employees.id'), nullable=True)
    
    # Relationships
    reviewer = db.relationship('Employee', foreign_keys=[reviewer_id])
    goals = db.relationship('PerformanceGoal', backref='review', cascade='all, delete-orphan')
    skills = db.relationship('SkillAssessment', backref='review', cascade='all, delete-orphan')

class PerformanceGoal(db.Model):
    __tablename__ = 'performance_goals'
    
    id = db.Column(db.String(36), primary_key=True)
    employee_id = db.Column(db.String(36), db.ForeignKey('employees.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    progress = db.Column(db.Integer, default=0)  # 0-100
    status = db.Column(db.Enum('not-started', 'in-progress', 'completed'), default='not-started')
    due_date = db.Column(db.Date)
    review_id = db.Column(db.String(36), db.ForeignKey('performance_reviews.id'), nullable=True)

class SkillAssessment(db.Model):
    __tablename__ = 'skill_assessments'
    
    id = db.Column(db.String(36), primary_key=True)
    employee_id = db.Column(db.String(36), db.ForeignKey('employees.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    score = db.Column(db.Integer, nullable=False)  # 0-100
    review_id = db.Column(db.String(36), db.ForeignKey('performance_reviews.id'), nullable=True)
