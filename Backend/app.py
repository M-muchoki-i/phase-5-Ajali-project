from flask import Flask
from flask_migrate import Migrate
from flask_restful import Api
from models import db

# Import your resource classes
from resources.user import UserResources
from resources.report import ReportResource
from resources.location import LocationResource

app = Flask(__name__)

# Configure the app
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///ajali.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False  # optional but recommended

# Initialize extensions
api = Api(app)
migrate = Migrate(app, db)
db.init_app(app)

# Register resource routes
api.add_resource(UserResources, '/user', '/user/<int:id>')
api.add_resource(ReportResource, '/reports', '/reports/<int:report_id>')
api.add_resource(LocationResource, '/locations', '/locations/<int:location_id>')

if __name__ == '__main__':
    app.run(debug=True)
