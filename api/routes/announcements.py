
from flask import Blueprint, request, jsonify
import uuid
from datetime import datetime
from sqlalchemy import or_
from models import db, Announcement, Employee, Department
from schemas import AnnouncementSchema

announcements_bp = Blueprint('announcements', __name__)
announcement_schema = AnnouncementSchema()
announcements_schema = AnnouncementSchema(many=True)

@announcements_bp.route('', methods=['GET'])
def get_announcements():
    """Get announcements with filtering options"""
    # Get query parameters
    department_id = request.args.get('departmentId')
    employee_id = request.args.get('employeeId')
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')
    page = request.args.get('page', 1, type=int)
    page_size = request.args.get('pageSize', 10, type=int)
    
    # Start building the query with joins to get creator and department names
    query = db.session.query(
        Announcement,
        Employee.name.label('created_by_name'),
        Employee.role.label('created_by_role'),
        Department.name.label('department_name')
    ).join(
        Employee, Employee.id == Announcement.created_by
    ).outerjoin(
        Department, Department.id == Announcement.department_id
    )
    
    # Apply filters
    if department_id:
        # Get announcements that are either global or for this specific department
        query = query.filter(or_(
            Announcement.is_global == True,
            Announcement.department_id == department_id
        ))
    else:
        # If no department specified, only get global announcements
        query = query.filter(Announcement.is_global == True)
    
    if employee_id:
        # Get announcements created by this employee
        query = query.filter(Announcement.created_by == employee_id)
    
    if start_date:
        query = query.filter(Announcement.date >= datetime.strptime(start_date, '%Y-%m-%d').date())
    
    if end_date:
        query = query.filter(Announcement.date <= datetime.strptime(end_date, '%Y-%m-%d').date())
    
    # Order by date (newest first)
    query = query.order_by(Announcement.date.desc())
    
    # Get total count before pagination
    total_count = query.count()
    
    # Apply pagination
    results = query.paginate(page=page, per_page=page_size, error_out=False).items
    
    # Process results to include joined data
    announcements = []
    for announcement, created_by_name, created_by_role, department_name in results:
        announcement_dict = announcement_schema.dump(announcement)
        announcement_dict['created_by_name'] = created_by_name
        announcement_dict['created_by_role'] = created_by_role
        announcement_dict['department_name'] = department_name
        announcements.append(announcement_dict)
    
    response_data = {
        'data': announcements,
        'totalCount': total_count,
        'page': page,
        'pageSize': page_size
    }
    
    return jsonify(response_data)

@announcements_bp.route('/<id>', methods=['GET'])
def get_announcement(id):
    """Get a single announcement by ID"""
    result = db.session.query(
        Announcement,
        Employee.name.label('created_by_name'),
        Employee.role.label('created_by_role'),
        Department.name.label('department_name')
    ).join(
        Employee, Employee.id == Announcement.created_by
    ).outerjoin(
        Department, Department.id == Announcement.department_id
    ).filter(Announcement.id == id).first()
    
    if not result:
        return jsonify({'error': 'Announcement not found'}), 404
    
    announcement, created_by_name, created_by_role, department_name = result
    announcement_dict = announcement_schema.dump(announcement)
    announcement_dict['created_by_name'] = created_by_name
    announcement_dict['created_by_role'] = created_by_role
    announcement_dict['department_name'] = department_name
    
    return jsonify({'data': announcement_dict})

@announcements_bp.route('', methods=['POST'])
def create_announcement():
    """Create a new announcement"""
    # Get JSON data
    json_data = request.get_json()
    if not json_data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        # Validate incoming data
        data = announcement_schema.load(json_data)
        
        # Create new announcement
        new_announcement = Announcement(
            id=str(uuid.uuid4()),
            title=data.get('title'),
            content=data.get('content'),
            date=data.get('date') or datetime.utcnow().date(),
            priority=data.get('priority', 'medium'),
            icon=data.get('icon', 'bell'),
            created_by=data.get('created_by'),
            is_global=data.get('is_global', False),
            department_id=data.get('department_id'),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        db.session.add(new_announcement)
        db.session.commit()
        
        # Get the created announcement with joined data
        result = db.session.query(
            Announcement,
            Employee.name.label('created_by_name'),
            Employee.role.label('created_by_role'),
            Department.name.label('department_name')
        ).join(
            Employee, Employee.id == Announcement.created_by
        ).outerjoin(
            Department, Department.id == Announcement.department_id
        ).filter(Announcement.id == new_announcement.id).first()
        
        announcement, created_by_name, created_by_role, department_name = result
        announcement_dict = announcement_schema.dump(announcement)
        announcement_dict['created_by_name'] = created_by_name
        announcement_dict['created_by_role'] = created_by_role
        announcement_dict['department_name'] = department_name
        
        return jsonify({'data': announcement_dict}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@announcements_bp.route('/<id>', methods=['PUT'])
def update_announcement(id):
    """Update an existing announcement"""
    # Find the announcement
    announcement = Announcement.query.get(id)
    if not announcement:
        return jsonify({'error': 'Announcement not found'}), 404
    
    # Get JSON data
    json_data = request.get_json()
    if not json_data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        # Validate data
        data = announcement_schema.load(json_data, partial=True)
        
        # Update fields
        if 'title' in data:
            announcement.title = data['title']
        if 'content' in data:
            announcement.content = data['content']
        if 'date' in data and data['date']:
            announcement.date = data['date']
        if 'priority' in data:
            announcement.priority = data['priority']
        if 'icon' in data:
            announcement.icon = data['icon']
        if 'is_global' in data:
            announcement.is_global = data['is_global']
        if 'department_id' in data:
            announcement.department_id = data['department_id']
        
        announcement.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        # Get the updated announcement with joined data
        result = db.session.query(
            Announcement,
            Employee.name.label('created_by_name'),
            Employee.role.label('created_by_role'),
            Department.name.label('department_name')
        ).join(
            Employee, Employee.id == Announcement.created_by
        ).outerjoin(
            Department, Department.id == Announcement.department_id
        ).filter(Announcement.id == id).first()
        
        announcement, created_by_name, created_by_role, department_name = result
        announcement_dict = announcement_schema.dump(announcement)
        announcement_dict['created_by_name'] = created_by_name
        announcement_dict['created_by_role'] = created_by_role
        announcement_dict['department_name'] = department_name
        
        return jsonify({'data': announcement_dict})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@announcements_bp.route('/<id>', methods=['DELETE'])
def delete_announcement(id):
    """Delete an announcement"""
    announcement = Announcement.query.get(id)
    if not announcement:
        return jsonify({'error': 'Announcement not found'}), 404
    
    try:
        db.session.delete(announcement)
        db.session.commit()
        return jsonify({'message': f'Announcement {id} deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
