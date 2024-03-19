

from models import ConnectorSpecification

class ConnectorSpecificationRepository:
    @staticmethod
    def get(id):
       return ConnectorSpecification.query.filter_by(id=id).one_or_none()