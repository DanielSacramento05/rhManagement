
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Employee(db.Model):
    __tablename__ = 'employees'
    
    id = db.Column(db.String(36), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    phone = db.Column(db.String(20), nullable=True)
    position = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    hire_date = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(20), default='active')
    manager_id = db.Column(db.String(36), db.ForeignKey('employees.id'), nullable=True)
    image_url = db.Column(db.String(255), nullable=True)
    password_hash = db.Column(db.String(255), nullable=True)
    
    # Role field to determine if user is admin, manager, or employee
    role = db.Column(db.String(20), default='employee')
    
    # Relationships
    manager = db.relationship('Employee', remote_side=[id], backref='reports')
    absences = db.relationship('Absence', foreign_keys='Absence.employee_id', backref='employee', lazy='dynamic')
    performance_reviews = db.relationship('PerformanceReview', foreign_keys='PerformanceReview.employee_id', backref='employee', lazy='dynamic')
    time_clock_entries = db.relationship('TimeClock', backref='employee', lazy='dynamic')
    created_announcements = db.relationship('Announcement', backref='creator', lazy='dynamic')

class Department(db.Model):
    __tablename__ = 'departments'
    
    id = db.Column(db.String(36), primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.String(255), nullable=True)
    manager_id = db.Column(db.String(36), db.ForeignKey('employees.id'), nullable=True)
    
    # Relationships
    manager = db.relationship('Employee', backref='managed_departments')
    announcements = db.relationship('Announcement', backref='department', lazy='dynamic')

class Absence(db.Model):
    __tablename__ = 'absences'
    
    id = db.Column(db.String(36), primary_key=True)
    employee_id = db.Column(db.String(36), db.ForeignKey('employees.id', ondelete='CASCADE'), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default='pending')
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    notes = db.Column(db.Text, nullable=True)
    approved_by = db.Column(db.String(36), db.ForeignKey('employees.id'), nullable=True)
    request_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    approver = db.relationship('Employee', foreign_keys=[approved_by])

class PerformanceReview(db.Model):
    __tablename__ = 'performance_reviews'
    
    id = db.Column(db.String(36), primary_key=True)
    employee_id = db.Column(db.String(36), db.ForeignKey('employees.id', ondelete='CASCADE'), nullable=False)
    review_date = db.Column(db.Date, nullable=False)
    review_type = db.Column(db.String(50), nullable=False)
    overall_score = db.Column(db.Float, nullable=False)
    last_review_date = db.Column(db.Date, nullable=True)
    next_review_date = db.Column(db.Date, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    reviewer_id = db.Column(db.String(36), db.ForeignKey('employees.id'), nullable=True)
    
    # Relationships
    reviewer = db.relationship('Employee', foreign_keys=[reviewer_id])
    goals = db.relationship('PerformanceGoal', backref='review', lazy='dynamic')
    skill_assessments = db.relationship('SkillAssessment', backref='review', lazy='dynamic')

class PerformanceGoal(db.Model):
    __tablename__ = 'performance_goals'
    
    id = db.Column(db.String(36), primary_key=True)
    employee_id = db.Column(db.String(36), db.ForeignKey('employees.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    progress = db.Column(db.Integer, default=0)
    status = db.Column(db.String(20), default='not-started')
    due_date = db.Column(db.Date, nullable=True)
    review_id = db.Column(db.String(36), db.ForeignKey('performance_reviews.id'), nullable=True)

class SkillAssessment(db.Model):
    __tablename__ = 'skill_assessments'
    
    id = db.Column(db.String(36), primary_key=True)
    employee_id = db.Column(db.String(36), db.ForeignKey('employees.id', ondelete='CASCADE'), nullable=False)
    review_id = db.Column(db.String(36), db.ForeignKey('performance_reviews.id'), nullable=True)
    name = db.Column(db.String(100), nullable=False)
    score = db.Column(db.Float, nullable=False)

class TimeClock(db.Model):
    __tablename__ = 'time_clock'
    
    id = db.Column(db.String(36), primary_key=True)
    employee_id = db.Column(db.String(36), db.ForeignKey('employees.id', ondelete='CASCADE'), nullable=False)
    date = db.Column(db.String(10), nullable=False)  # Format: YYYY-MM-DD
    clock_in_time = db.Column(db.String(8), nullable=False)  # Format: HH:MM:SS
    clock_out_time = db.Column(db.String(8), nullable=True)  # Format: HH:MM:SS
    total_hours = db.Column(db.Float, nullable=True)
    status = db.Column(db.String(20), default='active')  # active or completed

# New Announcement model
class Announcement(db.Model):
    __tablename__ = 'announcements'
    
    id = db.Column(db.String(36), primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    date = db.Column(db.Date, default=datetime.utcnow().date)
    priority = db.Column(db.String(20), default='medium')  # low, medium, high
    icon = db.Column(db.String(50), default='bell')
    
    # Who created this announcement
    created_by = db.Column(db.String(36), db.ForeignKey('employees.id'), nullable=False)
    
    # Is this announcement global (company-wide) or just for a specific department
    is_global = db.Column(db.Boolean, default=False)
    department_id = db.Column(db.String(36), db.ForeignKey('departments.id'), nullable=True)
    
    # Audit timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
