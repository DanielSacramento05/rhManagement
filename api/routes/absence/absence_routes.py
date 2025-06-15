
from flask import Blueprint, request, jsonify
import uuid
from models import db, Absence, Employee
from schemas import AbsenceSchema
from .absence_utils import update_employee_statuses_based_on_absences, enrich_absence_with_employee
import datetime

absences_bp = Blueprint('absences', __name__)
absence_schema = AbsenceSchema()
absences_schema = AbsenceSchema(many=True)

@absences_bp.route('', methods=['GET'])
def get_absences():
    print(f"=== ABSENCES DEBUG - FUNCTION CALLED ===")
    
    # Get query parameters for filtering and pagination
    page = request.args.get('page', 1, type=int)
    page_size = request.args.get('pageSize', 10, type=int)
    employee_id = request.args.get('employeeId', '')
    type = request.args.get('type', '')
    status = request.args.get('status', '')
    start_date = request.args.get('startDate', '')
    end_date = request.args.get('endDate', '')
    department = request.args.get('department', '')
    exclude_employee_id = request.args.get('excludeEmployeeId', '')
    
    print(f"=== ABSENCES DEBUG ===")
    print(f"Query params: page={page}, pageSize={page_size}, employeeId={employee_id}, status={status}, department={department}, excludeEmployeeId={exclude_employee_id}")
    print(f"Raw request args: {dict(request.args)}")
    
    # Start building the query
    query = Absence.query
    
    # Apply filters
    if employee_id:
        query = query.filter(Absence.employee_id == employee_id)
        print(f"Applied employee_id filter: {employee_id}")
    
    if department:
        # Filter by department through employee relationship - explicitly specify the join condition
        query = query.join(Employee, Absence.employee_id == Employee.id).filter(Employee.department == department)
        print(f"Applied department filter: {department}")
    
    # Apply exclude_employee_id filter AFTER department filter
    if exclude_employee_id:
        query = query.filter(Absence.employee_id != exclude_employee_id)
        print(f"Excluded employee_id: {exclude_employee_id}")
    
    if type:
        query = query.filter(Absence.type == type)
        print(f"Applied type filter: {type}")
    
    if status:
        query = query.filter(Absence.status == status)
        print(f"Applied status filter: {status}")
    
    if start_date:
        query = query.filter(Absence.start_date >= start_date)
        print(f"Applied start_date filter: {start_date}")
    
    if end_date:
        query = query.filter(Absence.end_date <= end_date)
        print(f"Applied end_date filter: {end_date}")
    
    # Check all absences before sorting to see status distribution
    all_absences_for_debug = query.all()
    status_count = {}
    for abs in all_absences_for_debug:
        status_count[abs.status] = status_count.get(abs.status, 0) + 1
    print(f"Status distribution before sorting: {status_count}")
    
    # Order by status with pending first, then by request_date descending
    # Using a simpler approach: order by status != 'pending', then by request_date
    query = query.order_by(
        (Absence.status != 'pending').asc(),
        Absence.request_date.desc()
    )
    
    print(f"Applied ordering: pending first, then by request_date desc")
    
    # Get total count before pagination
    total_count = query.count()
    print(f"Total count: {total_count}")
    
    # Apply pagination
    absences = query.paginate(page=page, per_page=page_size, error_out=False).items
    
    # Debug: Print the status of each absence in the result
    print(f"Absences on page {page}:")
    for i, abs in enumerate(absences):
        print(f"  {i+1}. ID: {abs.id[:8]}..., Status: {abs.status}, Request Date: {abs.request_date}")
    
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
        
        # Ensure requestDate is properly formatted
        if absence.request_date:
            absence_data['requestDate'] = absence.request_date.isoformat()
        else:
            # If no request_date is set, use the created timestamp or current time
            absence_data['requestDate'] = datetime.datetime.now().isoformat()
        
        result_data.append(absence_data)
    
    print(f"=== END DEBUG ===")
    
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
    absence = Absence.query.get_or_404(id)
    absence_data = absence_schema.dump(absence)
    
    # Enrich with employee details
    absence_data = enrich_absence_with_employee(absence_data, absence.employee_id)
    
    return jsonify({'data': absence_data})

@absences_bp.route('', methods=['POST'])
def create_absence():
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
        result = enrich_absence_with_employee(result, employee.id)
        
        return jsonify({'data': result}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@absences_bp.route('/<id>', methods=['PUT'])
def update_absence(id):
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
        result = absence_schema.dump(absence)
        result = enrich_absence_with_employee(result, absence.employee_id)
        
        return jsonify({'data': result})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
