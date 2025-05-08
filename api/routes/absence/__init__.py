
from flask import Blueprint
from .absence_routes import absences_bp
from .absence_status_routes import absence_status_bp
from .absence_utils import update_employee_statuses_based_on_absences

# Create a combined blueprint for absences
absences_combined_bp = Blueprint('absences_combined', __name__, url_prefix='/absences')

# Register the sub-blueprints without url_prefix (it's already in the combined blueprint)
absences_combined_bp.register_blueprint(absences_bp)
absences_combined_bp.register_blueprint(absence_status_bp)

# Run the update function on module load to ensure correct statuses
try:
    from models import db
    with db.app.app_context():
        update_employee_statuses_based_on_absences()
except Exception as e:
    print(f"Could not update employee statuses on module load: {str(e)}")
