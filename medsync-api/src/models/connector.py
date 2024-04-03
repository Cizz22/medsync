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
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    connector_definition_id = db.Column(db.Integer, db.ForeignKey('connector_definition.id'), nullable=False)
    name = db.Column(db.String(256), nullable=False)
    configuration = db.Column(JSON, nullable=False)
    connector_type = db.Column(db.String(36), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    
    connector_definition = db.relationship("ConnectorDefinition", backref="connectors")
    source_connections = db.relationship("Connection", backref="source")
    dest_connections = db.relationship("Connection", backref="destination")
    user = db.relationship("User", backref="connectors")

    def __init__(self, user_id, connector_definition_id, name, configuration, connector_type):
        """ Create a new connector """
        self.user_id = user_id
        self.connector_definition_id = connector_definition_id
        self.name = name
        self.configuration = configuration
        self.connector_type = connector_type
        