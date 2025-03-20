
from marshmallow import Schema, fields, validate

class EmployeeSchema(Schema):
    id = fields.String(dump_only=True)
    name = fields.String(required=True)
    position = fields.String(required=True)
    department = fields.String(required=True)
    email = fields.Email(required=True)
    phone = fields.String(required=True)
    status = fields.String(validate=validate.OneOf(['active', 'on-leave', 'remote']))
    imageUrl = fields.String(attribute='image_url', data_key='imageUrl')
    hireDate = fields.Date(attribute='hire_date', data_key='hireDate')
    managerId = fields.String(attribute='manager_id', data_key='managerId')

class DepartmentSchema(Schema):
    id = fields.String(dump_only=True)
    name = fields.String(required=True)
    description = fields.String()
    managerId = fields.String(attribute='manager_id', data_key='managerId')

class AbsenceSchema(Schema):
    id = fields.String(dump_only=True)
    employeeId = fields.String(attribute='employee_id', data_key='employeeId', required=True)
    employeeName = fields.String(data_key='employeeName', dump_only=True)
    department = fields.String(dump_only=True)
    position = fields.String(dump_only=True)
    type = fields.String(validate=validate.OneOf(['Vacation', 'Sick Leave', 'Personal', 'Training']))
    status = fields.String(validate=validate.OneOf(['pending', 'approved', 'declined']))
    startDate = fields.Date(attribute='start_date', data_key='startDate', required=True)
    endDate = fields.Date(attribute='end_date', data_key='endDate', required=True)
    notes = fields.String()
    approvedBy = fields.String(attribute='approved_by', data_key='approvedBy')
    requestDate = fields.DateTime(attribute='request_date', data_key='requestDate', dump_only=True)
    imageUrl = fields.String(data_key='imageUrl', dump_only=True)

class PerformanceReviewSchema(Schema):
    id = fields.String(dump_only=True)
    employeeId = fields.String(attribute='employee_id', data_key='employeeId', required=True)
    employeeName = fields.String(data_key='employeeName', dump_only=True)
    department = fields.String(dump_only=True)
    position = fields.String(dump_only=True)
    reviewDate = fields.Date(attribute='review_date', data_key='reviewDate', required=True)
    reviewType = fields.String(attribute='review_type', data_key='reviewType', 
                               validate=validate.OneOf(['Quarterly', 'Semi-Annual', 'Annual']))
    overallScore = fields.Integer(attribute='overall_score', data_key='overallScore', 
                                  validate=validate.Range(min=0, max=100))
    lastReviewDate = fields.Date(attribute='last_review_date', data_key='lastReviewDate')
    nextReviewDate = fields.Date(attribute='next_review_date', data_key='nextReviewDate')
    notes = fields.String()
    reviewerId = fields.String(attribute='reviewer_id', data_key='reviewerId')
    imageUrl = fields.String(data_key='imageUrl', dump_only=True)

class PerformanceGoalSchema(Schema):
    id = fields.String(dump_only=True)
    employeeId = fields.String(attribute='employee_id', data_key='employeeId', required=True)
    title = fields.String(required=True)
    description = fields.String()
    progress = fields.Integer(validate=validate.Range(min=0, max=100))
    status = fields.String(validate=validate.OneOf(['not-started', 'in-progress', 'completed']))
    dueDate = fields.Date(attribute='due_date', data_key='dueDate')
    reviewId = fields.String(attribute='review_id', data_key='reviewId')

class SkillAssessmentSchema(Schema):
    id = fields.String(dump_only=True)
    employeeId = fields.String(attribute='employee_id', data_key='employeeId', required=True)
    name = fields.String(required=True)
    score = fields.Integer(validate=validate.Range(min=0, max=100))
    reviewId = fields.String(attribute='review_id', data_key='reviewId')
