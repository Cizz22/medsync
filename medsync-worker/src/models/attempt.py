from . import db
from .abc import BaseModel, MetaBaseModel
from sqlalchemy.dialects.postgresql import JSONB
    
    
class Attempt(db.Model, BaseModel, metaclass=MetaBaseModel):
    """ The Attempt model """
    
    __tablename__ = "attempt"
    
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('job.id'), nullable=False)
    attempt_number = db.Column(db.Integer, nullable=False)
    log_path = db.Column(db.String(256), nullable=True)
    output = db.Column(JSONB(astext_type=db.Text()), nullable=True)
    status = db.Column(db.String(36), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    ended_at = db.Column(db.DateTime, nullable=True)
    
    def __init__(self, job_id, attempt_number, status):
        """ Create a new Attempt """
        self.job_id = job_id
        self.attempt_number = attempt_number
        self.status = status