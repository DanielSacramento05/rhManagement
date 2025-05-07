
from flask import Blueprint, request, jsonify
import uuid
import datetime
from models import db, Employee, TimeClock
from schemas import TimeClockSchema

time_clock_bp = Blueprint('time_clock', __name__)
time_clock_schema = TimeClockSchema()
time_clocks_schema = TimeClockSchema(many=True)

@time_clock_bp.route('', methods=['GET'])
def get_time_clock_entries():
    # Get query parameters for filtering and pagination
    page = request.args.get('page', 1, type=int)
    page_size = request.args.get('pageSize', 10, type=int)
    employee_id = request.args.get('employeeId', '')
    status = request.args.get('status', '')
    start_date = request.args.get('startDate', '')
    end_date = request.args.get('endDate', '')
    
    # Start building the query
    query = TimeClock.query
    
    # Apply filters
    if employee_id:
        query = query.filter(TimeClock.employee_id == employee_id)
    
    if status:
        query = query.filter(TimeClock.status == status)
    
    if start_date:
        query = query.filter(TimeClock.date >= start_date)
    
    if end_date:
        query = query.filter(TimeClock.date <= end_date)
    
    # Order by date and clock-in time, latest first
    query = query.order_by(TimeClock.date.desc(), TimeClock.clock_in_time.desc())
    
    # Get total count before pagination
    total_count = query.count()
    
    # Apply pagination
    entries = query.paginate(page=page, per_page=page_size, error_out=False).items
    
    # Prepare response
    result = {
        'data': time_clocks_schema.dump(entries),
        'totalCount': total_count,
        'page': page,
        'pageSize': page_size
    }
    
    return jsonify(result)

@time_clock_bp.route('/active/<employee_id>', methods=['GET'])
def get_active_entry(employee_id):
    # Find active time clock entry for the employee
    active_entry = TimeClock.query.filter_by(
        employee_id=employee_id,
        status='active'
    ).first()
    
    # Return null if no active entry
    if not active_entry:
        return jsonify({'data': None})
    
    return jsonify({'data': time_clock_schema.dump(active_entry)})

@time_clock_bp.route('/clock-in', methods=['POST'])
def clock_in():
    # Check if employee already has an active entry
    json_data = request.get_json()
    employee_id = json_data.get('employeeId')
    
    if not employee_id:
        return jsonify({'error': 'Employee ID is required'}), 400
    
    # Verify employee exists
    employee = Employee.query.get(employee_id)
    if not employee:
        return jsonify({'error': 'Employee not found'}), 404
        
    # Check if employee is already clocked in
    active_entry = TimeClock.query.filter_by(
        employee_id=employee_id,
        status='active'
    ).first()
    
    if active_entry:
        return jsonify({'error': 'Employee is already clocked in'}), 400
        
    # Get the current date and time
    now = datetime.datetime.now()
    today = now.strftime('%Y-%m-%d')
    current_time = now.strftime('%H:%M:%S')
    
    # Create new time clock entry
    new_entry = TimeClock(
        id=str(uuid.uuid4()),
        employee_id=employee_id,
        date=today,
        clock_in_time=current_time,
        status='active'
    )
    
    db.session.add(new_entry)
    
    try:
        db.session.commit()
        return jsonify({'data': time_clock_schema.dump(new_entry)}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@time_clock_bp.route('/clock-out', methods=['POST'])
def clock_out():
    # Get employee ID
    json_data = request.get_json()
    employee_id = json_data.get('employeeId')
    
    if not employee_id:
        return jsonify({'error': 'Employee ID is required'}), 400
    
    # Find the active time clock entry
    active_entry = TimeClock.query.filter_by(
        employee_id=employee_id,
        status='active'
    ).first()
    
    if not active_entry:
        return jsonify({'error': 'No active time clock entry found'}), 400
        
    # Get the current time
    now = datetime.datetime.now()
    current_time = now.strftime('%H:%M:%S')
    
    # Calculate hours worked
    clock_in = datetime.datetime.strptime(active_entry.date + ' ' + active_entry.clock_in_time, '%Y-%m-%d %H:%M:%S')
    clock_out = datetime.datetime.strptime(active_entry.date + ' ' + current_time, '%Y-%m-%d %H:%M:%S')
    
    # Handle overnight shifts
    if clock_out < clock_in:
        clock_out = clock_out + datetime.timedelta(days=1)
    
    hours_worked = (clock_out - clock_in).total_seconds() / 3600
    
    # Update the entry
    active_entry.clock_out_time = current_time
    active_entry.total_hours = round(hours_worked, 2)
    active_entry.status = 'completed'
    
    try:
        db.session.commit()
        return jsonify({'data': time_clock_schema.dump(active_entry)})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@time_clock_bp.route('/<id>', methods=['GET'])
def get_time_clock_entry(id):
    entry = TimeClock.query.get_or_404(id)
    return jsonify({'data': time_clock_schema.dump(entry)})

@time_clock_bp.route('/<id>', methods=['DELETE'])
def delete_time_clock_entry(id):
    entry = TimeClock.query.get_or_404(id)
    
    try:
        db.session.delete(entry)
        db.session.commit()
        return jsonify({'data': {'message': f'Time clock entry {id} deleted successfully'}}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
