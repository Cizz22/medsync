from flask import Flask
from flask.blueprints import Blueprint
from flask_migrate import Migrate
from flask_cors import CORS
from flask.cli import with_appcontext

from utils import response, error_handlers

import config
import routes
from models import db


"""Create an application."""
server = Flask(__name__)

"""Server Configuration"""
server.debug = config.DEBUG
server.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
server.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = config.SQLALCHEMY_TRACK_MODIFICATIONS
server.config["SECRET_KEY"] = config.SECRET_KEY


"""Database Configuration"""
db.init_app(server)
db.app = server

"""Migration Configuration"""
migrate = Migrate(server, db)


"""CORS Configuration"""
CORS(server)

# # create command function
# @click.command(name='drop')
# @with_appcontext
# def drop():
#     db.drop_all()
#     return "oke"

# server.cli.add_command(drop)
# server.cli.add_command(mainSeeder)


@server.route("/")
def main():        
    return response({
        "message": "Welcome to ETL API",
        "documentation": "",
    }, 200)

@server.errorhandler(Exception)
def handle_error(e):
    return error_handlers(e)


for blueprint in vars(routes).values():
    if isinstance(blueprint, Blueprint):
        server.register_blueprint(blueprint, url_prefix=config.APPLICATION_ROOT)

if __name__ == "__main__":
    server.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)