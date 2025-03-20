
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from models import db
from routes.employees import employees_bp
from routes.departments import departments_bp
from routes.absences import absences_bp
from routes.performance import performance_bp

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"mysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@"
    f"{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

# Initialize database
db.init_app(app)

# Register blueprints
app.register_blueprint(employees_bp, url_prefix='/api/employees')
app.register_blueprint(departments_bp, url_prefix='/api/departments')
app.register_blueprint(absences_bp, url_prefix='/api/absences')
app.register_blueprint(performance_bp, url_prefix='/api/performance')

@app.route('/')
def index():
    return {'message': 'HR Management API is running'}

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database tables if they don't exist
    app.run(debug=True)
