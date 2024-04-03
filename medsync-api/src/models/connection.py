
"""
Define the Connection model
"""
from . import db
from .abc import BaseModel, MetaBaseModel
from sqlalchemy.dialects.postgresql import JSONB


class Connection(db.Model, BaseModel, metaclass=MetaBaseModel):
    """ The Connection model """

    __tablename__ = "connection"

    id = db.Column(db.Integer, primary_key=True)
    source_id = db.Column(db.Integer, db.ForeignKey(
        'connector.id'), nullable=False)
    destination_id = db.Column(
        db.Integer, db.ForeignKey('connector.id'), nullable=False)
    name = db.Column(db.String(256), nullable=False)
    catalog = db.Column(JSONB(astext_type=db.Text()), nullable=False)
    status = db.Column(db.String(36), nullable=True)
    resource_requirements = db.Column(JSONB(astext_type=db.Text()), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False,
                           server_default=db.func.now())
    updated_at = db.Column(db.DateTime, nullable=False,
                           server_default=db.func.now())
    source_catalog_id = db.Column(db.Integer, nullable=True)
    schedule_type = db.Column(db.String(36), nullable=True)
    schedule_data = db.Column(JSONB(astext_type=db.Text()), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    source = db.relationship("Connector", foreign_keys=[
                             source_id], backref="source_connections")
    destination = db.relationship("Connector", foreign_keys=[
                                  destination_id], backref="dest_connections")
    user = db.relationship("User", backref="connections")

    def __init__(self, source_id, destination_id, name, catalog, status, resource_requirements, source_catalog_id, schedule_type, schedule_data):
        """ Create a new Connection """
        self.source_id = source_id
        self.destination_id = destination_id
        self.name = name
        self.catalog = catalog
        self.status = status
        self.resource_requirements = resource_requirements
        self.source_catalog_id = source_catalog_id
        self.schedule_type = schedule_type
        self.schedule_data = schedule_data
