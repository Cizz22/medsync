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

    def __init__(self, connector_definition_id, spec, documentation_url, docker_repository, docker_image_tag):
        """ Create a new connector specification """
        self.connector_definition_id = connector_definition_id
        self.spec = spec
        self.documentation_url = documentation_url
        self.docker_repository = docker_repository
        self.docker_image_tag = docker_image_tag