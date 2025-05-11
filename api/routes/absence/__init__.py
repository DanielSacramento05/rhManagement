from flask import Blueprint
from .absence_routes import absences_bp
from .absence_status_routes import absence_status_bp

# Create a combined blueprint for absences
absences_combined_bp = Blueprint('absences_combined', __name__, url_prefix='/absences')

# Register the sub-blueprints without url_prefix (it's already in the combined blueprint)
absences_combined_bp.register_blueprint(absences_bp)
absences_combined_bp.register_blueprint(absence_status_bp)

# Move the status update to be handled by the app context in app.py instead
# This prevents the circular import issue
