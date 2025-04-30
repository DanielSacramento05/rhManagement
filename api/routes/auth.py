
from flask import Blueprint, request, jsonify
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, Employee
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
    
    # Determine role based on position or department (customize as needed)
    role = 'admin' if user.position.lower() == 'manager' else 'employee'
    
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
            'role': role
        },
        'token': token
    }), 200
