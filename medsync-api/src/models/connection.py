
"""
Define the Connection model
"""
from . import db
from .abc import BaseModel, MetaBaseModel
from sqlalchemy.dialects.postgresql import JSON

# create table "public"."connection" (
#   "id" uuid not null,
#   "namespace_definition" "public"."namespace_definition_type" not null,
#   "namespace_format" varchar(256),
#   "prefix" varchar(256),
#   "source_id" uuid not null,
#   "destination_id" uuid not null,
#   "name" varchar(256) not null,
#   "catalog" jsonb not null,
#   "status" "public"."status_type",
#   "schedule" jsonb,
#   "manual" boolean,
#   "resource_requirements" jsonb,
#   "created_at" timestamp(6) with time zone not null default current_timestamp,
#   "updated_at" timestamp(6) with time zone not null default current_timestamp,
#   "source_catalog_id" uuid,
#   "schedule_type" "public"."schedule_type",
#   "schedule_data" jsonb,
#   "geography" "public"."geography_type" not null default cast('AUTO' as geography_type),
#   "non_breaking_change_preference" "non_breaking_change_preference_type" not null default cast('ignore' as non_breaking_change_preference_type),
#   "breaking_change" boolean not null default false,
#   "field_selection_data" jsonb,
#   constraint "connection_pkey" primary key ("id")
# );

class Connection(db.Model, BaseModel, metaclass=MetaBaseModel):
    """ The Connection model """

    __tablename__ = "connection"

    id = db.Column(db.Integer, primary_key=True)
    source_id = db.Column(db.Integer, nullable=False)
    destination_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(256), nullable=False)
    catalog = db.Column(JSON, nullable=False)
    status = db.Column(db.String(36), nullable=True)
    resource_requirements = db.Column(JSON, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    source_catalog_id = db.Column(db.Integer, nullable=True)
    schedule_type = db.Column(db.String(36), nullable=True)
    schedule_data = db.Column(JSON, nullable=True)
    field_selection_data = db.Column(JSON, nullable=True)

    def __init__(self, namespace_definition, namespace_format, prefix, source_id, destination_id, name, catalog, status, schedule, manual, resource_requirements, source_catalog_id, schedule_type, schedule_data, geography, non_breaking_change_preference, breaking_change, field_selection_data):
        """ Create a new Connection """
        self.namespace_definition = namespace_definition
        self.namespace_format = namespace_format
        self.prefix = prefix
        self.source_id = source_id
        self.destination_id = destination_id
        self.name = name
        self.catalog = catalog
        self.status = status
        self.schedule = schedule
        self.manual = manual
        self.resource_requirements = resource_requirements
        self.source_catalog_id = source_catalog_id
        self.schedule_type = schedule_type
        self.schedule_data = schedule_data
        self.geography = geography
        self.non_breaking_change_preference = non_breaking_change_preference
        self.breaking_change = breaking_change
        self.field_selection_data = field_selection_data

