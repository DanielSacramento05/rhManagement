
from flask import Blueprint, request, jsonify
import uuid
from models import db, Absence, Employee
from schemas import AbsenceSchema

absences_bp = Blueprint('absences', __name__)
absence_schema = AbsenceSchema()
absences_schema = AbsenceSchema(many=True)

@absences_bp.route('', methods=['GET'])
def get_absences():
    # Get query parameters for filtering and pagination
    page = request.args.get('page', 1, type=int)
    page_size = request.args.get('pageSize', 10, type=int)
    employee_id = request.args.get('employeeId', '')
    type = request.args.get('type', '')
    status = request.args.get('status', '')
    start_date = request.args.get('startDate', '')
    end_date = request.args.get('endDate', '')
    
    # Start building the query
    query = Absence.query
    
    # Apply filters
    if employee_id:
        query = query.filter(Absence.employee_id == employee_id)
    
    if type:
        query = query.filter(Absence.type == type)
    
    if status:
        query = query.filter(Absence.status == status)
    
    if start_date:
        query = query.filter(Absence.start_date >= start_date)
    
    if end_date:
        query = query.filter(Absence.end_date <= end_date)
    
    # Get total count before pagination
    total_count = query.count()
    
    # Apply pagination
    absences = query.paginate(page=page, per_page=page_size, error_out=False).items
    
    # Prepare response
    result = {
        'data': absences_schema.dump(absences),
        'totalCount': total_count,
        'page': page,
        'pageSize': page_size
    }
    
    return jsonify(result)

@absences_bp.route('/<id>', methods=['GET'])
def get_absence(id):
    absence = Absence.query.get_or_404(id)
    return jsonify({'data': absence_schema.dump(absence)})

@absences_bp.route('', methods=['POST'])
def create_absence():
    # Validate and deserialize input
    json_data = request.get_json()
    
    try:
        data = absence_schema.load(json_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
    # Verify employee exists
    employee = Employee.query.get(data['employee_id'])
    if not employee:
        return jsonify({'error': 'Employee not found'}), 404
    
    # Create new absence
    new_absence = Absence(
        id=str(uuid.uuid4()),
        employee_id=data['employee_id'],
        type=data['type'],
        status=data.get('status', 'pending'),
        start_date=data['start_date'],
        end_date=data['end_date'],
        notes=data.get('notes'),
        approved_by=data.get('approved_by')
    )
    
    db.session.add(new_absence)
    
    try:
        db.session.commit()
        
        # Enrich the response with employee details
        result = absence_schema.dump(new_absence)
        result['employeeName'] = employee.name
        result['department'] = employee.department
        result['position'] = employee.position
        result['imageUrl'] = employee.image_url
        
        return jsonify({'data': result}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@absences_bp.route('/<id>', methods=['PUT'])
def update_absence(id):
    absence = Absence.query.get_or_404(id)
    
    # Get JSON data
    json_data = request.get_json()
    
    try:
        data = absence_schema.load(json_data, partial=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
    # Update absence fields
    for key, value in data.items():
        setattr(absence, key, value)
    
    try:
        db.session.commit()
        
        # Enrich the response with employee details
        employee = Employee.query.get(absence.employee_id)
        result = absence_schema.dump(absence)
        result['employeeName'] = employee.name
        result['department'] = employee.department
        result['position'] = employee.position
        result['imageUrl'] = employee.image_url
        
        return jsonify({'data': result})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@absences_bp.route('/<id>/status', methods=['PUT'])
def update_absence_status(id):
    absence = Absence.query.get_or_404(id)
    
    # Get JSON data
    json_data = request.get_json()
    
    if 'status' not in json_data:
        return jsonify({'error': 'Status is required'}), 400
    
    status = json_data['status']
    if status not in ['pending', 'approved', 'declined']:
        return jsonify({'error': 'Invalid status value'}), 400
    
    # Update status
    absence.status = status
    
    # If approving, set the approver
    if status == 'approved' and 'approvedBy' in json_data:
        absence.approved_by = json_data['approvedBy']
    
    try:
        db.session.commit()
        
        # Enrich the response with employee details
        employee = Employee.query.get(absence.employee_id)
        result = absence_schema.dump(absence)
        result['employeeName'] = employee.name
        result['department'] = employee.department
        result['position'] = employee.position
        result['imageUrl'] = employee.image_url
        
        return jsonify({'data': result})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@absences_bp.route('/<id>', methods=['DELETE'])
def delete_absence(id):
    absence = Absence.query.get_or_404(id)
    
    try:
        db.session.delete(absence)
        db.session.commit()
        return jsonify({'data': {'message': f'Absence {id} deleted successfully'}}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
