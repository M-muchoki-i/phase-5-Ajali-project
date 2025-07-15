from flask import Flask
from flask_migrate import Migrate
from flask_restful import Api
from models import db 

app = Flask(__name__)


# configuring our flask app through the config object
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///ajali.db"

# link flask-restful with flask
api = Api(app)

migrate = Migrate(app, db)

# link our db to the flask app
db.init_app(app)