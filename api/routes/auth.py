


from flask import Blueprint, request, jsonify
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, Employee, TimeClock
import jwt
import datetime
import os

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/set-password', methods=['POST'])
def set_password():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing email or password'}), 400
    
    # Find existing user
    user = Employee.query.filter_by(email=data['email']).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if user.password_hash:
        return jsonify({'error': 'User already has a password set'}), 409
    
    # Set the password for the existing user
    user.password_hash = generate_password_hash(data['password'])
    
    try:
        db.session.commit()
        
        # Generate token
        token = jwt.encode({
            'user_id': user.id,
            'email': user.email,
            'role': user.role,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
        }, os.getenv('SECRET_KEY'), algorithm='HS256')
        
        return jsonify({
            'message': 'Password set successfully',
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role,
                'status': user.status or 'out-of-office',
                'departmentId': None,  # No department_id field in model
                'departmentName': user.department,
                'managerId': user.manager_id
            },
            'token': token
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if required fields are provided
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if user already exists
    existing_user = Employee.query.filter_by(email=data['email']).first()
    
    if existing_user:
        return jsonify({'error': 'Email already registered'}), 409
    
    # Create new user - name is required for new users
    if not data.get('name'):
        return jsonify({'error': 'Name is required for new users'}), 400
    
    new_user = Employee(
        id=str(uuid.uuid4()),
        name=data['name'],
        email=data['email'],
        phone=data.get('phone', ''),
        position=data.get('position', 'Employee'),
        department=data.get('department', 'General'),
        status='out-of-office',
        hire_date=datetime.datetime.now().date(),
        role='employee'
    )
    
    new_user.password_hash = generate_password_hash(data['password'])
    
    try:
        db.session.add(new_user)
        db.session.commit()
        
        token = jwt.encode({
            'user_id': new_user.id,
            'email': new_user.email,
            'role': new_user.role,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
        }, os.getenv('SECRET_KEY'), algorithm='HS256')
        
        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'id': new_user.id,
                'email': new_user.email,
                'name': new_user.name,
                'role': new_user.role,
                'status': 'out-of-office',
                'departmentId': None,  # No department_id field in model
                'departmentName': new_user.department,
                'managerId': new_user.manager_id
            },
            'token': token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/check-user', methods=['POST'])
def check_user():
    data = request.get_json()
    
    if not data or not data.get('email'):
        return jsonify({'error': 'Email is required'}), 400
    
    user = Employee.query.filter_by(email=data['email']).first()
    
    if not user:
        return jsonify({'exists': False, 'hasPassword': False}), 200
    
    has_password = user.password_hash is not None and user.password_hash != ''
    
    return jsonify({
        'exists': True,
        'hasPassword': has_password,
        'name': user.name if user else None
    }), 200

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing email or password'}), 400
    
    # Find user by email
    user = Employee.query.filter_by(email=data['email']).first()
    
    # Check if user exists and has a password set
    if not user:
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Check if user has a password hash set
    if not user.password_hash:
        return jsonify({'error': 'No password set for this account. Please use the registration form to set your password.'}), 401
    
    # Verify password
    if not check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Check if user is inactive
    if user.status == 'inactive':
        return jsonify({'error': 'Account has been deactivated. Please contact an administrator.'}), 403
    
    # Use the role from the database instead of determining it from position
    user_role = user.role if user.role else 'employee'
    
    # Check if user is currently clocked in
    active_entry = TimeClock.query.filter_by(employee_id=user.id, status='active').first()
    
    # Set appropriate status based on employee status and clock-in status
    employee_status = user.status
    display_status = 'out-of-office'  # Default to out-of-office
    
    if employee_status == 'inactive':
        # Inactive employees stay inactive
        display_status = 'inactive'
    elif employee_status == 'on-leave':
        # On-leave employees stay on-leave
        display_status = 'on-leave'
    elif active_entry:
        # If clocked in, use their status (either active or remote)
        display_status = 'remote' if employee_status == 'remote' else 'active'
    else:
        # Not clocked in means out-of-office
        display_status = 'out-of-office'
    
    print(f"Login: User {user.name}, Role: {user_role}, Status: {employee_status}, Display Status: {display_status}, Clocked in: {active_entry is not None}")
    
    # Generate token
    token = jwt.encode({
        'user_id': user.id,
        'email': user.email,
        'role': user_role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
    }, os.getenv('SECRET_KEY'), algorithm='HS256')
    
    return jsonify({
        'message': 'Login successful',
        'user': {
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'role': user_role,
            'status': display_status,
            'departmentId': None,  # No department_id field in model
            'departmentName': user.department,
            'managerId': user.manager_id
        },
        'token': token
    }), 200


