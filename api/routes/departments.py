
from flask import Blueprint, request, jsonify
import uuid
from models import db, Department
from schemas import DepartmentSchema

departments_bp = Blueprint('departments', __name__)
department_schema = DepartmentSchema()
departments_schema = DepartmentSchema(many=True)

@departments_bp.route('', methods=['GET'])
def get_departments():
    # Get query parameters for filtering and pagination
    page = request.args.get('page', 1, type=int)
    page_size = request.args.get('pageSize', 10, type=int)
    
    # Get total count before pagination
    total_count = Department.query.count()
    
    # Get departments with pagination
    departments = Department.query.paginate(page=page, per_page=page_size, error_out=False).items
    
    result = {
        'data': departments_schema.dump(departments),
        'totalCount': total_count,
        'page': page,
        'pageSize': page_size
    }
    
    return jsonify(result)

@departments_bp.route('/<id>', methods=['GET'])
def get_department(id):
    department = Department.query.get_or_404(id)
    return jsonify({'data': department_schema.dump(department)})

@departments_bp.route('', methods=['POST'])
def create_department():
    # Validate and deserialize input
    json_data = request.get_json()
    
    try:
        data = department_schema.load(json_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
    # Create new department
    new_department = Department(
        id=str(uuid.uuid4()),
        name=data['name'],
        description=data.get('description'),
        manager_id=data.get('manager_id')
    )
    
    db.session.add(new_department)
    
    try:
        db.session.commit()
        return jsonify({'data': department_schema.dump(new_department)}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@departments_bp.route('/<id>', methods=['PUT'])
def update_department(id):
    department = Department.query.get_or_404(id)
    
    # Get JSON data
    json_data = request.get_json()
    
    try:
        data = department_schema.load(json_data, partial=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
    # Update department fields
    for key, value in data.items():
        setattr(department, key, value)
    
    try:
        db.session.commit()
        return jsonify({'data': department_schema.dump(department)})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@departments_bp.route('/<id>', methods=['DELETE'])
def delete_department(id):
    department = Department.query.get_or_404(id)
    
    try:
        db.session.delete(department)
        db.session.commit()
        return jsonify({'data': {'message': f'Department {id} deleted successfully'}}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
