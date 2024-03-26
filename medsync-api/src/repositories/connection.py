from models import Connection

class ConnectionRepository:
    """ The repository for the connection model """

    @staticmethod
    def get_by(**kwargs):
        return Connection.query.filter_by(**kwargs)

    @staticmethod
    def create(source_id, destination_id, name, catalog, status, resource_requirements, source_catalog_id, schedule_type, schedule_data):
        connection = Connection(source_id, destination_id, name, catalog, status, resource_requirements, source_catalog_id, schedule_type, schedule_data)
        connection.save()
        return connection
    
    @staticmethod
    def get_by_id(id):
        """ Query a user by id """
        return Connection.query.filter_by(id=id).one_or_none()

    @staticmethod
    def update(id, **columns):
        """ Update user information """

        connection = ConnectionRepository.get_by_id(id)

        if connection:
            for key, value in columns.items():
                setattr(connection, key, value)

            connection.commit()

        return connection
    
    @staticmethod
    def get_all():
        """Get all connections"""
        return Connection.query.all()
