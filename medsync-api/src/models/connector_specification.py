"""
Define the Connector specification model
"""
from . import db
from .abc import BaseModel, MetaBaseModel
from sqlalchemy.dialects.postgresql import JSON


class ConnectorSpecification(db.Model, BaseModel, metaclass=MetaBaseModel):
    """ The Connector Specification model """

    __tablename__ = "connector_specification"

    id = db.Column(db.Integer, primary_key=True)
    connector_definition_id = db.Column(db.Integer, db.ForeignKey('connector_definition.id'), nullable=False)
    spec = db.Column(JSON, nullable=False)
    documentation_url = db.Column(db.String(256), nullable=True)
    docker_repository = db.Column(db.String(256), nullable=True)
    docker_image_tag = db.Column(db.String(256), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())

    connector_definition = db.relationship("ConnectorDefinition", back_populates="connector_specifications")

    def __init__(self, name, spec):
        """ Create a new Connector Specification """
        self.name = name
        self.spec = spec