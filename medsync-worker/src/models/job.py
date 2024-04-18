from . import db
from .abc import BaseModel, MetaBaseModel
from sqlalchemy.dialects.postgresql import JSONB



class Job(db.Model, BaseModel, metaclass=MetaBaseModel):
    """ The Job model """

    __tablename__ = "job"

    id = db.Column(db.Integer, primary_key=True)
    scope = db.Column(db.Integer, nullable=False) # Scope mean id like connection_id or source_id
    config_type = db.Column(db.String(36), nullable=False)
    config = db.Column(JSONB(astext_type=db.Text()), nullable=False)
    status = db.Column(db.String(36), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())

    def __init__(self, scope, config_type, config, status):
        """ Create a new Job """
        self.scope = scope
        self.config_type = config_type
        self.config = config
        self.status = status
        