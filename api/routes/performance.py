
from flask import Blueprint, request, jsonify
import uuid
from models import db, PerformanceReview, PerformanceGoal, SkillAssessment, Employee
from schemas import PerformanceReviewSchema, PerformanceGoalSchema, SkillAssessmentSchema

performance_bp = Blueprint('performance', __name__)
review_schema = PerformanceReviewSchema()
reviews_schema = PerformanceReviewSchema(many=True)
goal_schema = PerformanceGoalSchema()
goals_schema = PerformanceGoalSchema(many=True)
skill_schema = SkillAssessmentSchema()
skills_schema = SkillAssessmentSchema(many=True)

# Performance Reviews routes
@performance_bp.route('/reviews', methods=['GET'])
def get_reviews():
    # Get query parameters for filtering and pagination
    page = request.args.get('page', 1, type=int)
    page_size = request.args.get('pageSize', 10, type=int)
    employee_id = request.args.get('employeeId', '')
    department = request.args.get('department', '')
    review_type = request.args.get('reviewType', '')
    min_score = request.args.get('minScore', type=int)
    max_score = request.args.get('maxScore', type=int)
    
    # Start building the query
    query = PerformanceReview.query
    
    # Apply filters
    if employee_id:
        query = query.filter(PerformanceReview.employee_id == employee_id)
    
    if department:
        query = query.join(Employee).filter(Employee.department == department)
    
    if review_type:
        query = query.filter(PerformanceReview.review_type == review_type)
    
    if min_score is not None:
        query = query.filter(PerformanceReview.overall_score >= min_score)
    
    if max_score is not None:
        query = query.filter(PerformanceReview.overall_score <= max_score)
    
    # Get total count before pagination
    total_count = query.count()
    
    # Apply pagination
    reviews = query.paginate(page=page, per_page=page_size, error_out=False).items
    
    # Prepare response with additional employee info
    result_data = []
    for review in reviews:
        employee = Employee.query.get(review.employee_id)
        review_data = review_schema.dump(review)
        review_data['employeeName'] = employee.name
        review_data['department'] = employee.department
        review_data['position'] = employee.position
        review_data['imageUrl'] = employee.image_url
        result_data.append(review_data)
    
    result = {
        'data': result_data,
        'totalCount': total_count,
        'page': page,
        'pageSize': page_size
    }
    
    return jsonify(result)

@performance_bp.route('/reviews/<id>', methods=['GET'])
def get_review(id):
    review = PerformanceReview.query.get_or_404(id)
    
    # Enrich with employee data
    employee = Employee.query.get(review.employee_id)
    result = review_schema.dump(review)
    result['employeeName'] = employee.name
    result['department'] = employee.department
    result['position'] = employee.position
    result['imageUrl'] = employee.image_url
    
    return jsonify({'data': result})

@performance_bp.route('/reviews', methods=['POST'])
def create_review():
    # Validate and deserialize input
    json_data = request.get_json()
    
    try:
        data = review_schema.load(json_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
    # Verify employee exists
    employee = Employee.query.get(data['employee_id'])
    if not employee:
        return jsonify({'error': 'Employee not found'}), 404
    
    # Create new review
    new_review = PerformanceReview(
        id=str(uuid.uuid4()),
        employee_id=data['employee_id'],
        review_date=data['review_date'],
        review_type=data['review_type'],
        overall_score=data['overall_score'],
        last_review_date=data.get('last_review_date'),
        next_review_date=data.get('next_review_date'),
        notes=data.get('notes'),
        reviewer_id=data.get('reviewer_id')
    )
    
    db.session.add(new_review)
    
    try:
        db.session.commit()
        
        # Enrich the response with employee details
        result = review_schema.dump(new_review)
        result['employeeName'] = employee.name
        result['department'] = employee.department
        result['position'] = employee.position
        result['imageUrl'] = employee.image_url
        
        return jsonify({'data': result}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@performance_bp.route('/reviews/<id>', methods=['PUT'])
def update_review(id):
    review = PerformanceReview.query.get_or_404(id)
    
    # Get JSON data
    json_data = request.get_json()
    
    try:
        data = review_schema.load(json_data, partial=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
    # Update review fields
    for key, value in data.items():
        setattr(review, key, value)
    
    try:
        db.session.commit()
        
        # Enrich the response with employee details
        employee = Employee.query.get(review.employee_id)
        result = review_schema.dump(review)
        result['employeeName'] = employee.name
        result['department'] = employee.department
        result['position'] = employee.position
        result['imageUrl'] = employee.image_url
        
        return jsonify({'data': result})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@performance_bp.route('/reviews/<id>', methods=['DELETE'])
def delete_review(id):
    review = PerformanceReview.query.get_or_404(id)
    
    try:
        db.session.delete(review)
        db.session.commit()
        return jsonify({'data': {'message': f'Performance review {id} deleted successfully'}}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Performance Goals routes
@performance_bp.route('/goals', methods=['GET'])
def get_goals():
    # Get employee ID filter
    employee_id = request.args.get('employeeId', '')
    
    # Build query
    query = PerformanceGoal.query
    
    if employee_id:
        query = query.filter(PerformanceGoal.employee_id == employee_id)
    
    goals = query.all()
    
    return jsonify({'data': goals_schema.dump(goals)})

@performance_bp.route('/goals', methods=['POST'])
def create_goal():
    # Validate and deserialize input
    json_data = request.get_json()
    
    try:
        data = goal_schema.load(json_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
    # Verify employee exists
    if not Employee.query.get(data['employee_id']):
        return jsonify({'error': 'Employee not found'}), 404
    
    # Create new goal
    new_goal = PerformanceGoal(
        id=str(uuid.uuid4()),
        employee_id=data['employee_id'],
        title=data['title'],
        description=data.get('description'),
        progress=data.get('progress', 0),
        status=data.get('status', 'not-started'),
        due_date=data.get('due_date'),
        review_id=data.get('review_id')
    )
    
    db.session.add(new_goal)
    
    try:
        db.session.commit()
        return jsonify({'data': goal_schema.dump(new_goal)}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@performance_bp.route('/goals/<id>', methods=['PUT'])
def update_goal(id):
    goal = PerformanceGoal.query.get_or_404(id)
    
    # Get JSON data
    json_data = request.get_json()
    
    try:
        data = goal_schema.load(json_data, partial=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
    # Update goal fields
    for key, value in data.items():
        setattr(goal, key, value)
    
    try:
        db.session.commit()
        return jsonify({'data': goal_schema.dump(goal)})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Skills Assessment routes
@performance_bp.route('/skills', methods=['GET'])
def get_skills():
    # Get employee ID filter
    employee_id = request.args.get('employeeId', '')
    
    # Build query
    query = SkillAssessment.query
    
    if employee_id:
        query = query.filter(SkillAssessment.employee_id == employee_id)
    
    skills = query.all()
    
    return jsonify({'data': skills_schema.dump(skills)})

@performance_bp.route('/skills', methods=['POST'])
def save_skills():
    # Validate and deserialize input
    json_data = request.get_json()
    
    if not isinstance(json_data, list):
        return jsonify({'error': 'Expected an array of skills'}), 400
    
    result_skills = []
    
    for skill_data in json_data:
        try:
            data = skill_schema.load(skill_data)
        except Exception as e:
            return jsonify({'error': str(e)}), 400
        
        # Check if skill exists for update or create new
        if 'id' in data and data['id']:
            skill = SkillAssessment.query.get(data['id'])
            if skill:
                # Update existing skill
                for key, value in data.items():
                    setattr(skill, key, value)
            else:
                return jsonify({'error': f"Skill with ID {data['id']} not found"}), 404
        else:
            # Create new skill
            skill = SkillAssessment(
                id=str(uuid.uuid4()),
                employee_id=data['employee_id'],
                name=data['name'],
                score=data['score'],
                review_id=data.get('review_id')
            )
            db.session.add(skill)
        
        result_skills.append(skill)
    
    try:
        db.session.commit()
        return jsonify({'data': skills_schema.dump(result_skills)}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
