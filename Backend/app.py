import os
from flask import Flask
from flask_migrate import Migrate
from flask_restful import Api

from models import db
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from resources.user import UserResources, LoginResource
from resources.status_update import StatusUpdateResource
from resources.report import ReportResource
from resources.location import LocationResource

# import the configs stored inside the env file
load_dotenv()

app = Flask(__name__)





# configuring our flask app through the config object
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///ajali.db"
app.config["SQLALCHEMY_ECHO"] = True
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False  # optional but recommended
# access token
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET")  # Change this!
# app.config["JWT_ACCESS_TOKEN_EXPIRES"] = ACCESS_EXPIRES
jwt = JWTManager(app)

bcrypt = Bcrypt(app)
#app = Flask(__name__)

# Initialize extensions
api = Api(app)
migrate = Migrate(app, db)
db.init_app(app)



# Register resource routes
api.add_resource(UserResources, "/user", "/user/<int:id>")
api.add_resource(LoginResource, "/login")
api.add_resource(ReportResource, "/reports", "/reports/<int:report_id>")
api.add_resource(LocationResource, "/locations", "/locations/<int:location_id>")
api.add_resource(StatusUpdateResource, "/status_update /<int:id>")

if __name__ == "__main__":
    app.run(debug=True)










