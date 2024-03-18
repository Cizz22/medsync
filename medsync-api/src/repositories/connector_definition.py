"""Define the Connector Definition repository"""

from models import ConnectorDefinition

class ConnectorDefinitionRepository:
    """ The repository for the connection definition model """

    @staticmethod
    def get_by(**kwargs):
        return ConnectorDefinition.query.filter_by(**kwargs)

    @staticmethod
    def create(name, icon, connector_type, source_type, spec, resource_requirements, public, custom, max_seconds_between_messages, default_version_id, icon_url):
        """ Create a new connector definition """
        connector_definition = ConnectorDefinition(name, icon, connector_type, source_type, spec, resource_requirements, public, custom, max_seconds_between_messages, default_version_id, icon_url)
        return connector_definition.save()
    
    @staticmethod
    def get_by_id(id):
        """ Query a user by id """
        return ConnectorDefinition.query.filter_by(id=id).one_or_none()

    @staticmethod
    def update(id, **columns):
        """ Update user information """

        connector_definition = ConnectorDefinitionRepository.get_by_id(id)

        if connector_definition:
            for key, value in columns.items():
                setattr(connector_definition, key, value)

            connector_definition.commit()

        return connector_definition
    
