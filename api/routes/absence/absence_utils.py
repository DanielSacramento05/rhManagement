
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
    
    # Get today's date in YYYY-MM-DD format for comparison
    today_date = datetime.datetime.now().strftime("%Y-%m-%d")
    
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
        else:
            # Employee doesn't have an active absence for today
            # Check if they've clocked in today
            clock_entry = TimeClock.query.filter(
                TimeClock.employee_id == employee.id,
                TimeClock.date == today_date
            ).first()
            
            if clock_entry:
                if clock_entry.clock_out_time:
                    # Employee clocked in and out today
                    if employee.status != 'out-of-office':
                        print(f"Setting employee {employee.name} to out-of-office (clocked out)")
                        employee.status = 'out-of-office'
                else:
                    # Employee is still clocked in
                    if employee.status != 'active':
                        print(f"Setting employee {employee.name} to active (still clocked in)")
                        employee.status = 'active'
            else:
                # Employee hasn't clocked in today and has no absence
                if employee.status not in ['out-of-office', 'remote']:
                    print(f"Setting employee {employee.name} to out-of-office (no clock-in, no absence)")
                    employee.status = 'out-of-office'
    
    try:
        db.session.commit()
        print("Employee statuses updated successfully")
    except Exception as e:
        db.session.rollback()
        print(f"Error updating employee statuses: {str(e)}")
