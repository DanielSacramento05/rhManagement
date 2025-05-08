
from flask import Blueprint, request, jsonify
import uuid
from sqlalchemy import or_
from models import db, Employee
from schemas import EmployeeSchema

employees_bp = Blueprint('employees', __name__)
employee_schema = EmployeeSchema()
employees_schema = EmployeeSchema(many=True)

@employees_bp.route('', methods=['GET'])
def get_employees():
    # Get query parameters for filtering and pagination
    page = request.args.get('page', 1, type=int)
    page_size = request.args.get('pageSize', 10, type=int)
    search = request.args.get('search', '')
    department = request.args.get('department', '')
    status = request.args.get('status', '')
    sort_by = request.args.get('sortBy', 'name')
    sort_direction = request.args.get('sortDirection', 'asc')
    
    # Start building the query
    query = Employee.query
    
    # Apply filters
    if search:
        query = query.filter(or_(
            Employee.name.ilike(f'%{search}%'),
            Employee.email.ilike(f'%{search}%'),
            Employee.position.ilike(f'%{search}%')
        ))
    
    if department:
        query = query.filter(Employee.department == department)
    
    if status:
        query = query.filter(Employee.status == status)
    
    # Apply sorting
    if sort_direction == 'asc':
        query = query.order_by(getattr(Employee, sort_by))
    else:
        query = query.order_by(getattr(Employee, sort_by).desc())
    
    # Get total count before pagination
    total_count = query.count()
    
    # Apply pagination
    employees = query.paginate(page=page, per_page=page_size, error_out=False).items
    
    # Prepare response
    result = {
        'data': employees_schema.dump(employees),
        'totalCount': total_count,
        'page': page,
        'pageSize': page_size
    }
    
    return jsonify(result)

@employees_bp.route('/<id>', methods=['GET'])
def get_employee(id):
    employee = Employee.query.get_or_404(id)
    return jsonify({'data': employee_schema.dump(employee)})

@employees_bp.route('', methods=['POST'])
def create_employee():
    # Validate and deserialize input
    json_data = request.get_json()
    
    try:
        data = employee_schema.load(json_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
    # Create new employee
    new_employee = Employee(
        id=str(uuid.uuid4()),
        name=data['name'],
        position=data['position'],
        department=data['department'],
        email=data['email'],
        phone=data['phone'],
        status=data.get('status', 'active'),
        image_url=data.get('image_url'),
        hire_date=data.get('hire_date'),
        manager_id=data.get('manager_id'),
        role=data.get('role', 'employee')  # Default role to employee
    )
    
    db.session.add(new_employee)
    
    try:
        db.session.commit()
        return jsonify({'data': employee_schema.dump(new_employee)}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@employees_bp.route('/<id>', methods=['PUT'])
def update_employee(id):
    employee = Employee.query.get_or_404(id)
    
    # Get JSON data
    json_data = request.get_json()
    
    try:
        data = employee_schema.load(json_data, partial=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
    # Update employee fields
    for key, value in data.items():
        setattr(employee, key, value)
    
    try:
        db.session.commit()
        return jsonify({'data': employee_schema.dump(employee)})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@employees_bp.route('/<id>', methods=['DELETE'])
def delete_employee(id):
    employee = Employee.query.get_or_404(id)
    
    try:
        db.session.delete(employee)
        db.session.commit()
        return jsonify({'data': {'message': f'Employee {id} deleted successfully'}}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# New endpoint for updating user roles
@employees_bp.route('/<id>/role', methods=['PUT'])
def update_employee_role(id):
    employee = Employee.query.get_or_404(id)
    
    # Get JSON data
    json_data = request.get_json()
    if not json_data or 'role' not in json_data:
        return jsonify({'error': 'Role is required'}), 400
    
    # Validate role
    role = json_data['role']
    valid_roles = ['admin', 'manager', 'employee']
    if role not in valid_roles:
        return jsonify({'error': f'Invalid role. Must be one of {", ".join(valid_roles)}'}), 400
    
    try:
        # Update role
        employee.role = role
        db.session.commit()
        return jsonify({'data': employee_schema.dump(employee)})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
