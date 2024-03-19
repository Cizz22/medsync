""""""

from connector import Connector

class ConnectorRepository:
    def __init__(self):
        pass
    
    def get_all():
        return Connector.query.all()

    @staticmethod
    def create(user_id, actor_definition_id, name, configuration, actor_type, default_version_id):
        connector = Connector(user_id, connector_definition_id, name, configuration, actor_type, default_version_id)
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