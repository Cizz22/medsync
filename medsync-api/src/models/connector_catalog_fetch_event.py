
"""
Define the Connector CAtalog Fetch Event model
"""
from . import db
from .abc import BaseModel, MetaBaseModel
from sqlalchemy.dialects.postgresql import JSON

# create table "public"."actor_catalog_fetch_event" (
#   "id" uuid not null,
#   "actor_catalog_id" uuid not null,
#   "actor_id" uuid not null,
#   "config_hash" varchar(32) not null,
#   "actor_version" varchar(256) not null,
#   "created_at" timestamp(6) with time zone not null default current_timestamp,
#   "modified_at" timestamp(6) with time zone not null default current_timestamp,
#   constraint "actor_catalog_fetch_event_pkey" primary key ("id")
# );

class ConnectorCatalogFetchEvent(db.Model, BaseModel, metaclass=MetaBaseModel):
    """ The Connector Catalog Fetch Event model """

    __tablename__ = "connector_catalog_fetch_event"

    id = db.Column(db.Integer, primary_key=True)
    connector_catalog_id = db.Column(db.Integer, nullable=False)
    connector_id = db.Column(db.Integer, nullable=False)
    config_hash = db.Column(db.String(32), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())

    def __init__(self, connector_catalog_id, connector_id, config_hash, connector_version):
        """ Create a new Connector Catalog Fetch Event """
        self.connector_catalog_id = connector_catalog_id
        self.connector_id = connector_id
        self.config_hash = config_hash
        self.connector_version = connector_version