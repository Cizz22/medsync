"""
Define the Connector Definition model
"""
from . import db
from .abc import BaseModel, MetaBaseModel
from sqlalchemy.dialects.postgresql import JSON

# create table "public"."connector_definition" (
#   "id" uuid not null,
#   "name" varchar(256) not null,
#   "icon" varchar(256),
#   "actor_type" "public"."actor_type" not null,
#   "source_type" "public"."source_type",
#   "created_at" timestamp(6) with time zone not null default current_timestamp,
#   "updated_at" timestamp(6) with time zone not null default current_timestamp,
#   "tombstone" boolean not null default false,
#   "resource_requirements" jsonb,
#   "public" boolean not null default false,
#   "custom" boolean not null default false,
#   "max_seconds_between_messages" int,
#   "default_version_id" uuid,
#   "icon_url" varchar(256),
#   constraint "actor_definition_pkey" primary key ("id")
# );

class ConnectorDefinition(db.Model, BaseModel, metaclass=MetaBaseModel):
    """ The Connector Definition model """

    __tablename__ = "connector_definition"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), nullable=False)
    icon = db.Column(db.String(256), nullable=True)
    connector_type = db.Column(db.String(36), nullable=False)
    source_type = db.Column(db.String(36), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    resource_requirements = db.Column(JSON, nullable=True)
    public = db.Column(db.Boolean, nullable=False, default=False)
    icon_url = db.Column(db.String(256), nullable=True)
    
    connectors = db.relationship("Connector", backref="connector_definition")
    connector_specifications = db.relationship("ConnectorSpecification", back_populates="connector_definition")
    
    def __init__(self, name, icon, connector_type, source_type, spec, resource_requirements, public, custom, max_seconds_between_messages, default_version_id, icon_url):
        """ Create a new Connector Definition """
        self.name = name
        self.connector_type = connector_type
        self.spec = spec
        self.source_type = source_type
        self.icon = icon
        self.resource_requirements = resource_requirements
        self.public = public
        self.icon_url = icon_url