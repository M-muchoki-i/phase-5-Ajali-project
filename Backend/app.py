from flask import Flask
from flask_cors import CORS  # ✅ Import CORS
from flask_migrate import Migrate
from flask_restful import Api

from models import db
from resources.user import UserResources
from status_update import StatusUpdateResource

app = Flask(__name__)

# ✅ Enable CORS for frontend-backend communication
CORS(app)

# Config
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///../instance/ajali.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)

# Register Resources
api.add_resource(UserResources, '/user', '/user/<int:id>')
api.add_resource(StatusUpdateResource, '/status_updates', '/status_updates/<int:id>')

if __name__ == "__main__":
    app.run(debug=True)
