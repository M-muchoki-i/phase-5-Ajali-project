import os 
from flask import Flask
from flask_migrate import Migrate
from flask_restful import Api

from models import db 
from  flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from resources.user import UserResources,LoginResource
from resources.report import ReportResource
# import the configs stored inside the env file
load_dotenv()
app = Flask(__name__)





# configuring our flask app through the config object
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///ajali.db"
app.config["SQLALCHEMY_ECHO"] = True
# access token
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET")  # Change this!
# app.config["JWT_ACCESS_TOKEN_EXPIRES"] = ACCESS_EXPIRES
jwt = JWTManager(app)

bcrypt =Bcrypt(app)

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


api.add_resource(UserResources, '/user', '/user/<int:id>') 
api.add_resource(LoginResource, '/login') 
api.add_resource(ReportResource, '/report', '/report/<int:id>') 

# Register resource routes
api.add_resource(UserResources, '/user', '/user/<int:id>')
api.add_resource(ReportResource, '/reports', '/reports/<int:report_id>')
api.add_resource(LocationResource, '/locations', '/locations/<int:location_id>')

if __name__ == '__main__':
    app.run(debug=True)

