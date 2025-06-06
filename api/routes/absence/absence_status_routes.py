
from flask import Blueprint, request, jsonify
from models import db, Absence, Employee
from schemas import AbsenceSchema
from .absence_utils import update_employee_statuses_based_on_absences, enrich_absence_with_employee
import datetime

absence_status_bp = Blueprint('absence_status', __name__)
absence_schema = AbsenceSchema()

@absence_status_bp.route('/<id>/status', methods=['PUT'])
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
    elif status == 'declined':
        # If declining an absence that would be active today, make sure employee status is updated
        employee = Employee.query.get(absence.employee_id)
        if employee and employee.status == 'on-leave':
            # Check if this was the only approved absence for today
            today = datetime.datetime.now().date()
            other_active_absences = Absence.query.filter(
                Absence.employee_id == absence.employee_id,
                Absence.status == 'approved',
                Absence.start_date <= today,
                Absence.end_date >= today,
                Absence.id != absence.id  # Exclude the current absence being declined
            ).count()
            
            if other_active_absences == 0:
                employee.status = 'out-of-office'
                print(f"Declined absence for {employee.name} - setting status to out-of-office")
    
    try:
        db.session.commit()
        
        # Now check if we need to update any employee statuses
        # This ensures all employees with approved absences are properly marked
        update_employee_statuses_based_on_absences()
        
        # Enrich the response with employee details
        result = absence_schema.dump(absence)
        result = enrich_absence_with_employee(result, absence.employee_id)
        
        return jsonify({'data': result})
    except Exception as e:
        db.session.rollback()
        print(f"Error updating absence status: {str(e)}")
        return jsonify({'error': str(e)}), 500

@absence_status_bp.route('/<id>', methods=['DELETE'])
def delete_absence(id):
    absence = Absence.query.get_or_404(id)
    
    try:
        db.session.delete(absence)
        db.session.commit()
        return jsonify({'data': {'message': f'Absence {id} deleted successfully'}}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
