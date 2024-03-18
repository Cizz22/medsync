
"""
Define the Connector CAtalog model
"""
from . import db
from .abc import BaseModel, MetaBaseModel
from sqlalchemy.dialects.postgresql import JSON

class ConnectorCatalog(db.Model, BaseModel, metaclass=MetaBaseModel):
    """ The Connector Catalog model """

    __tablename__ = "connector_catalog"

    id = db.Column(db.Integer, primary_key=True)
    catalog = db.Column(JSON, nullable=False)
    catalog_hash = db.Column(db.String(32), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)

    def __init__(self, catalog, catalog_hash):
        """ Create a new Connector Catalog """
        self.catalog = catalog
        self.catalog_hash = catalog_hash