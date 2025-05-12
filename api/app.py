
from flask import Flask
from flask_cors import CORS
from models import db
import os
from dotenv import load_dotenv
from routes.employees import employees_bp
from routes.departments import departments_bp
from routes.absence import absences_combined_bp
from routes.performance import performance_bp
from routes.auth import auth_bp
from routes.time_clock import time_clock_bp
from routes.announcements import announcements_bp

# Load environment variables from .env file
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Simplified database URI configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = (
        f"mysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@"
        f"{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
    )
    
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Apply CORS globally to all routes - FIXED to prevent duplicate headers
    CORS(app, 
         origins="*", 
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
         expose_headers=["Content-Type", "Authorization"])
    
    # Initialize database
    db.init_app(app)
    
    # Create all database tables if they don't exist
    with app.app_context():
        db.create_all()
        
        # Run the employee status update after the app is fully initialized
        try:
            from routes.absence.absence_utils import update_employee_statuses_based_on_absences
            update_employee_statuses_based_on_absences()
            print("Employee statuses updated successfully on application start")
        except Exception as e:
            print(f"Error updating employee statuses on application start: {str(e)}")
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(employees_bp, url_prefix='/api/employees')
    app.register_blueprint(departments_bp, url_prefix='/api/departments')
    app.register_blueprint(performance_bp, url_prefix='/api/performance')
    app.register_blueprint(absences_combined_bp, url_prefix='/api/absences')
    app.register_blueprint(time_clock_bp, url_prefix='/api/time-clock')
    app.register_blueprint(announcements_bp, url_prefix='/api/announcements')
    
    @app.route('/')
    def hello():
        return {'message': 'HR Management API is running!'}
    
    # Remove the after_request handler that was adding duplicate headers
    # This was causing the CORS error by adding headers that were already added by flask-cors
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0')
