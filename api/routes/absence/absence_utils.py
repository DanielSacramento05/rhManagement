
from models import db, Absence, Employee, TimeClock
import datetime

def enrich_absence_with_employee(absence_data, employee_id):
    """
    Adds employee details to an absence data dictionary
    """
    employee = Employee.query.get(employee_id)
    if employee:
        absence_data['employeeName'] = employee.name
        absence_data['department'] = employee.department
        absence_data['position'] = employee.position
        absence_data['imageUrl'] = employee.image_url
    
    return absence_data

def update_employee_statuses_based_on_absences():
    """
    Updates all employee statuses based on current approved absences.
    Should be run after absence approvals or on a regular schedule.
    """
    # Get today's date as a datetime.date object, not a string
    today = datetime.datetime.now().date()
    print(f"Checking for employees who should be on leave today: {today}")
    
    # Get all employees
    employees = Employee.query.all()
    
    for employee in employees:
        # Skip inactive employees
        if employee.status == 'inactive':
            continue
            
        # Check if employee has an approved absence for today
        current_absence = Absence.query.filter(
            Absence.employee_id == employee.id,
            Absence.status == 'approved',
            Absence.start_date <= today,
            Absence.end_date >= today
        ).first()
        
        if current_absence:
            # If there's an approved absence covering today, set status to on-leave
            if employee.status != 'on-leave':
                print(f"Setting employee {employee.name} to on-leave due to approved absence")
                employee.status = 'on-leave'
        elif employee.status == 'on-leave':
            # Employee is marked as on-leave but doesn't have an active absence for today
            # This means their leave has ended - check if they've clocked in today
            
            # Get today's date in YYYY-MM-DD format for comparison
            today_date = datetime.datetime.now().strftime("%Y-%m-%d")
            
            # Check if employee has clocked in today
            clock_entry = TimeClock.query.filter(
                TimeClock.employee_id == employee.id,
                TimeClock.date == today_date
            ).first()
            
            if clock_entry:
                if clock_entry.clock_out_time:
                    employee.status = 'out-of-office'  # Clocked out
                else:
                    employee.status = 'active'  # Still clocked in
            else:
                print(f"Leave ended for {employee.name} - setting status to out-of-office")
                employee.status = 'out-of-office'  # No absence and no clock-in
    
    try:
        db.session.commit()
        print("Employee statuses updated successfully")
    except Exception as e:
        db.session.rollback()
        print(f"Error updating employee statuses: {str(e)}")
