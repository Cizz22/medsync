"""
Define the User model
"""
from . import db
from .abc import BaseModel, MetaBaseModel
import uuid
from flask_bcrypt import generate_password_hash, check_password_hash

class User(db.Model, BaseModel, metaclass=MetaBaseModel):
    """ The User model """

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(300), nullable=False)
    email = db.Column(db.String(300), nullable=False, unique=True)
    password = db.Column(db.String(300), nullable=False)
    type = db.Column(db.String(300), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    deleted_at = db.Column(db.DateTime, nullable=True, server_default=None)
    
    def __init__(self, name, email, type):
        """ Create a new User """
        self.name = name
        self.email = email
        self.type = type
    
    def set_password(self, password):
        self.password = generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return check_password_hash(self.password, password)
