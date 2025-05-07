
from flask import Flask
from flask_cors import CORS
from models import db
import os
from routes.employees import employees_bp
from routes.departments import departments_bp
from routes.absences import absences_bp
from routes.performance import performance_bp
from routes.auth import auth_bp
from routes.time_clock import time_clock_bp

def create_app():
    app = Flask(__name__)
    
    # Get database configuration from environment variables
    db_user = os.environ.get('DB_USER', 'root')
    db_password = os.environ.get('DB_PASSWORD', '')
    db_host = os.environ.get('DB_HOST', 'localhost')
    db_port = os.environ.get('DB_PORT', '3306')
    db_name = os.environ.get('DB_NAME', 'hr_management')
    
    # Construct database URI from environment variables
    if os.environ.get('DATABASE_URL'):
        app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
    
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Apply CORS globally to all routes
    CORS(app, 
         origins="*", 
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
         expose_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    
    # Initialize database
    db.init_app(app)
    
    # Create all database tables if they don't exist
    with app.app_context():
        db.create_all()
    
    # Register blueprints
    app.register_blueprint(employees_bp, url_prefix='/api/employees')
    app.register_blueprint(departments_bp, url_prefix='/api/departments')
    app.register_blueprint(absences_bp, url_prefix='/api/absences')
    app.register_blueprint(performance_bp, url_prefix='/api/performance')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(time_clock_bp, url_prefix='/api/time-clock')
    
    @app.route('/')
    def hello():
        return {'message': 'HR Management API is running!'}
    
    # Ensure CORS headers are set on all responses
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0')
