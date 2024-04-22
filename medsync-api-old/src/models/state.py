"""
Define the State model
"""
from . import db
from .abc import BaseModel, MetaBaseModel
from sqlalchemy.dialects.postgresql import JSON

# create table "public"."state" (
#   "id" uuid not null,
#   "connection_id" uuid not null,
#   "state" jsonb,
#   "created_at" timestamp(6) with time zone not null default current_timestamp,
#   "updated_at" timestamp(6) with time zone not null default current_timestamp,
#   "stream_name" text,
#   "namespace" text,
#   "type" "public"."state_type" not null default cast('LEGACY' as state_type),
#   constraint "state_pkey" primary key ("id", "connection_id"),
#   constraint "state__connection_id__stream_name__namespace__uq" unique ("connection_id", "stream_name", "namespace")
# );

class State(db.Model, BaseModel, metaclass=MetaBaseModel):
    """ The State model """

    __tablename__ = "state"

    id = db.Column(db.Integer, primary_key=True)
    connection_id = db.Column(db.Integer, nullable=False)
    state = db.Column(JSON, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    stream_name = db.Column(db.String(256), nullable=True)
    namespace = db.Column(db.String(256), nullable=True)
    type = db.Column(db.String(36), nullable=False)

    def __init__(self, connection_id, state, stream_name, namespace, type):
        """ Create a new State """
        self.connection_id = connection_id
        self.state = state
        self.stream_name = stream_name
        self.namespace = namespace
        self.type = type