"""
Define the Connector model
"""
from . import db
from .abc import BaseModel, MetaBaseModel
from sqlalchemy.dialects.postgresql import JSON


class Connector(db.Model, BaseModel, metaclass=MetaBaseModel):
    """ The Connector model """

    __tablename__ = "connector"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    connector_definition_id = db.Column(db.String(36), nullable=False)
    name = db.Column(db.String(256), nullable=False)
    configuration = db.Column(JSON, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    
    connector_definition = db.relationship("ConnectorDefinition", backref="connectors")

    def __init__(self, user_id, actor_definition_id, name, configuration, actor_type, default_version_id):
        """ Create a new Connector """
        self.user_id = user_id
        self.actor_definition_id = actor_definition_id
        self.name = name
        self.configuration = configuration
        self.actor_type = actor_type
        self.default_version_id = default_version_id