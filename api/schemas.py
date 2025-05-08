
from marshmallow import Schema, fields

class EmployeeSchema(Schema):
    id = fields.Str()
    name = fields.Str()
    email = fields.Str()
    phone = fields.Str(allow_none=True)
    position = fields.Str()
    department = fields.Str()
    hire_date = fields.Date(allow_none=True)
    status = fields.Str()
    manager_id = fields.Str(allow_none=True)
    image_url = fields.Str(allow_none=True)
    role = fields.Str()  # Added role field

class DepartmentSchema(Schema):
    id = fields.Str()
    name = fields.Str()
    description = fields.Str(allow_none=True)
    manager_id = fields.Str(allow_none=True)
    manager_name = fields.Str(allow_none=True)

class AbsenceSchema(Schema):
    id = fields.Str()
    employee_id = fields.Str()
    type = fields.Str()
    status = fields.Str()
    start_date = fields.Date()
    end_date = fields.Date()
    notes = fields.Str(allow_none=True)
    approved_by = fields.Str(allow_none=True)
    request_date = fields.DateTime(allow_none=True)
    
    # Fields added from joins (not stored in DB)
    employeeName = fields.Str(allow_none=True)
    department = fields.Str(allow_none=True)
    position = fields.Str(allow_none=True)
    imageUrl = fields.Str(allow_none=True)

class PerformanceReviewSchema(Schema):
    id = fields.Str()
    employee_id = fields.Str()
    review_date = fields.Date()
    review_type = fields.Str()
    overall_score = fields.Float()
    last_review_date = fields.Date(allow_none=True)
    next_review_date = fields.Date(allow_none=True)
    notes = fields.Str(allow_none=True)
    reviewer_id = fields.Str(allow_none=True)
    
    # Fields added from joins (not stored in DB)
    employeeName = fields.Str(allow_none=True)
    department = fields.Str(allow_none=True)
    position = fields.Str(allow_none=True)
    reviewerName = fields.Str(allow_none=True)
    imageUrl = fields.Str(allow_none=True)

class PerformanceGoalSchema(Schema):
    id = fields.Str()
    employee_id = fields.Str()
    title = fields.Str()
    description = fields.Str(allow_none=True)
    progress = fields.Int()
    status = fields.Str()
    due_date = fields.Date(allow_none=True)
    review_id = fields.Str(allow_none=True)

class SkillAssessmentSchema(Schema):
    id = fields.Str()
    employee_id = fields.Str()
    name = fields.Str()
    score = fields.Float()
    review_id = fields.Str(allow_none=True)

class TimeClockSchema(Schema):
    id = fields.Str()
    employee_id = fields.Str()
    date = fields.Str()
    clock_in_time = fields.Str()
    clock_out_time = fields.Str(allow_none=True)
    total_hours = fields.Float(allow_none=True)
    status = fields.Str()

# New schema for announcements
class AnnouncementSchema(Schema):
    id = fields.Str()
    title = fields.Str()
    content = fields.Str()
    date = fields.Date()
    priority = fields.Str()
    icon = fields.Str(allow_none=True)
    created_by = fields.Str()
    created_by_name = fields.Str(allow_none=True)  # Populated from join
    created_by_role = fields.Str(allow_none=True)  # Populated from join
    is_global = fields.Bool()
    department_id = fields.Str(allow_none=True)
    department_name = fields.Str(allow_none=True)  # Populated from join
    created_at = fields.DateTime(allow_none=True)
    updated_at = fields.DateTime(allow_none=True)
