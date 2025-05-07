from flask import Blueprint, request, jsonify
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, Employee, TimeClock
import jwt
import datetime
import os

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if required fields are provided
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if user already exists
    existing_user = Employee.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'error': 'Email already registered'}), 409
    
    # Create new user with hashed password
    new_user = Employee(
        id=str(uuid.uuid4()),
        name=data['name'],
        email=data['email'],
        phone=data.get('phone', ''),
        position=data.get('position', 'Employee'),
        department=data.get('department', 'General'),
        status='active',
        hire_date=datetime.datetime.now().date()
    )
    
    # Store password hash in a separate attribute
    new_user.password_hash = generate_password_hash(data['password'])
    
    try:
        db.session.add(new_user)
        db.session.commit()
        
        # Generate token
        token = jwt.encode({
            'user_id': new_user.id,
            'email': new_user.email,
            'role': 'employee',  # Default role for new users
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
        }, os.getenv('SECRET_KEY'), algorithm='HS256')
        
        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'id': new_user.id,
                'email': new_user.email,
                'name': new_user.name,
                'role': 'employee'
            },
            'token': token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing email or password'}), 400
    
    # Find user by email
    user = Employee.query.filter_by(email=data['email']).first()
    
    if not user or not hasattr(user, 'password_hash') or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Check if user is inactive
    if user.status == 'inactive':
        return jsonify({'error': 'Account has been deactivated. Please contact an administrator.'}), 403
    
    # Determine role based on position or department (customize as needed)
    role = 'admin' if user.position.lower() == 'manager' else 'employee'
    
    # Check if user is currently clocked in
    active_entry = TimeClock.query.filter_by(employee_id=user.id, status='active').first()
    
    # Set appropriate status based on clock-in status
    current_status = user.status
    if current_status == 'active' and active_entry:
        display_status = 'active'  # In office
    elif current_status == 'remote' and active_entry:
        display_status = 'remote'  # Remote work
    else:
        display_status = 'out-of-office'  # Not clocked in
    
    # Generate token
    token = jwt.encode({
        'user_id': user.id,
        'email': user.email,
        'role': role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
    }, os.getenv('SECRET_KEY'), algorithm='HS256')
    
    return jsonify({
        'message': 'Login successful',
        'user': {
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'role': role,
            'status': display_status
        },
        'token': token
    }), 200
