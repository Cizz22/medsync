""""""

from src.models import Connector

class ConnectorRepository:
    def __init__(self):
        pass
    
    def get_all():
        return Connector.query.all()
    
    def get_by(**kwargs):
        return Connector.query.filter_by(**kwargs)

    @staticmethod
    def create(user_id, connector_definition_id, name, configuration, connector_type):
        connector = Connector(user_id, connector_definition_id, name, configuration, connector_type)
        connector.save()
        return connector

    @staticmethod
    def get_by_id(id):
        """ Query a user by id """
        return Connector.query.filter_by(id=id).one_or_none()

    @staticmethod
    def update(id, **columns):
        """ Update user information """

        connector_definition = ConnectorRepository.get_by_id(id)

        if connector_definition:
            for key, value in columns.items():
                setattr(connector_definition, key, value)

            connector_definition.commit()

        return connector_definition
    
    @staticmethod
    def delete(id):
        connector = ConnectorRepository.get_by_id(id)
        connector.delete()
        return connector