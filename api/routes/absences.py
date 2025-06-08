
from flask import Blueprint, request, jsonify
import uuid
from models import db, Absence, Employee
from schemas import AbsenceSchema
import datetime

absences_bp = Blueprint('absences', __name__)
absence_schema = AbsenceSchema()
absences_schema = AbsenceSchema(many=True)

@absences_bp.route('', methods=['GET'])
def get_absences():
    # ... keep existing code (get_absences function)
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
    
    # Prepare response with enhanced employee details
    result_data = []
    for absence in absences:
        absence_data = absence_schema.dump(absence)
        
        # Get employee details
        employee = Employee.query.get(absence.employee_id)
        if employee:
            absence_data['employeeName'] = employee.name
            absence_data['department'] = employee.department
            absence_data['position'] = employee.position
            absence_data['imageUrl'] = employee.image_url
        
        result_data.append(absence_data)
    
    # Prepare response
    result = {
        'data': result_data,
        'totalCount': total_count,
        'page': page,
        'pageSize': page_size
    }
    
    return jsonify(result)

@absences_bp.route('/<id>', methods=['GET'])
def get_absence(id):
    # ... keep existing code (get_absence function)
    absence = Absence.query.get_or_404(id)
    absence_data = absence_schema.dump(absence)
    
    # Enrich with employee details
    employee = Employee.query.get(absence.employee_id)
    if employee:
        absence_data['employeeName'] = employee.name
        absence_data['department'] = employee.department
        absence_data['position'] = employee.position
        absence_data['imageUrl'] = employee.image_url
    
    return jsonify({'data': absence_data})

@absences_bp.route('', methods=['POST'])
def create_absence():
    # ... keep existing code (create_absence function)
    # Validate and deserialize input
    json_data = request.get_json()
    print("Received absence request data:", json_data)
    
    # Map frontend field names to backend field names
    if json_data:
        if 'employeeId' in json_data:
            json_data['employee_id'] = json_data.pop('employeeId')
        if 'startDate' in json_data:
            json_data['start_date'] = json_data.pop('startDate')
        if 'endDate' in json_data:
            json_data['end_date'] = json_data.pop('endDate')
    
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
    # ... keep existing code (update_absence function)
    absence = Absence.query.get_or_404(id)
    
    # Get JSON data
    json_data = request.get_json()
    
    # Map frontend field names to backend field names
    if json_data:
        if 'employeeId' in json_data:
            json_data['employee_id'] = json_data.pop('employeeId')
        if 'startDate' in json_data:
            json_data['start_date'] = json_data.pop('startDate')
        if 'endDate' in json_data:
            json_data['end_date'] = json_data.pop('endDate')
    
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
    print("Updating absence status with data:", json_data)
    
    if 'status' not in json_data:
        return jsonify({'error': 'Status is required'}), 400
    
    status = json_data['status']
    if status not in ['pending', 'approved', 'declined']:
        return jsonify({'error': 'Invalid status value'}), 400
    
    # Update status
    absence.status = status
    
    # If approving, set the approver and update employee status
    if status == 'approved':
        absence.approved_by = json_data.get('approvedBy')
        
        # Update employee status to on-leave if the absence covers the current date
        employee = Employee.query.get(absence.employee_id)
        if employee:
            # Get today's date as a datetime.date object
            today = datetime.datetime.now().date()
            
            # Make sure we're comparing date objects to date objects, not strings
            # Check if absence is current OR starts in the future
            is_current_or_future = (absence.start_date <= today and absence.end_date >= today) or \
                                   (absence.start_date > today)
            
            if is_current_or_future:
                # If current, set to on-leave immediately
                if absence.start_date <= today and absence.end_date >= today:
                    employee.status = 'on-leave'
                    print(f"Setting employee {employee.name} status to on-leave because absence is current")
    
    try:
        db.session.commit()
        
        # Now check if we need to update any employee statuses
        # This ensures all employees with approved absences are properly marked
        update_employee_statuses_based_on_absences()
        
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
    # ... keep existing code (delete_absence function)
    absence = Absence.query.get_or_404(id)
    
    try:
        db.session.delete(absence)
        db.session.commit()
        return jsonify({'data': {'message': f'Absence {id} deleted successfully'}}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Helper function to update employee statuses based on absences
def update_employee_statuses_based_on_absences():
    """
    Updates all employee statuses based on current approved absences.
    Should be run after absence approvals or on a regular schedule.
    """
    # Import here to avoid circular imports
    from routes.absence.absence_utils import update_employee_statuses_based_on_absences as update_statuses
    update_statuses()

# Run the update on module load to ensure we're starting with correct statuses
try:
    with db.app.app_context():
        update_employee_statuses_based_on_absences()
except Exception as e:
    print(f"Could not update employee statuses on module load: {str(e)}")
