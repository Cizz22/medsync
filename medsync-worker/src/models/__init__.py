from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .attempt import Attempt
from .job import Job