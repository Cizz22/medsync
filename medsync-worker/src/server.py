


# from temporal.background_check.activities.ssh_trace_activity import ssn_trace_activity
# from temporal.background_check.workflows.background_check_workflow import BackgroundCheck

# async def main():
#     client = await Client.connect(
#         "localhost:7233"  # The IP address of the Temporal Server on your network.
#     )

#     result = await client.execute_workflow(
#         BackgroundCheck,
#         "123-45-6789",
#         id="background-check-workflow",
#         task_queue="background-check",
#     )

#     print(result)

# if __name__ == "__main__":
#     asyncio.run(main())

from flask import Flask
from flask.blueprints import Blueprint
from flask_migrate import Migrate
from flask_cors import CORS
from flask.cli import with_appcontext

import asyncio

from temporalio.client import Client
from temporalio.worker import Worker

import src.config as config
# import src.routes as routes
from src.utils import response, handle_exception
# from src.models import db


"""Create an application."""
server = Flask(__name__)

"""Server Configuration"""
server.debug = config.DEBUG
server.config["SQLALCHEMY_DATABASE_URI"] = config.DB_URI
server.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = config.SQLALCHEMY_TRACK_MODIFICATIONS
server.config["SECRET_KEY"] = config.SECRET_KEY


"""Database Configuration"""
db.init_app(server)
db.app = server

"""Migration Configuration"""
migrate = Migrate(server, db)

"""CORS Configuration"""
CORS(server)



@server.route("/")
def main():
    return response({
        "message": "Worker handlers",
    }, 200)


@server.errorhandler(Exception)
def handle_error(e):
    return handle_exception(e)


for blueprint in vars(routes).values():
    if isinstance(blueprint, Blueprint):
        server.register_blueprint(
            blueprint, url_prefix=config.APPLICATION_ROOT)

if __name__ == "__main__":
    # Check if db exists, if not create it
    server.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)
