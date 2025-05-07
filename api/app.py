
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
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///hr_management.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Configure CORS with appropriate settings
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    
    # Initialize database
    db.init_app(app)
    
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
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0')
