
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
