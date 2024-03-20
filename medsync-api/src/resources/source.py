from flask_restful import Resource
from flask_restful.reqparse import Argument
from utils import parse_params, response, create_token, token_required
from repositories import ConnectorRepository

class SourceResources(Resource):
    """ Source resource """

    @token_required
    @parse_params(
        Argument("connector_definition_id", location="json", required=True, help="Connector Definition ID cannot be blank."),
        Argument("name", location="json", required=True, help="Name cannot be blank."),
        Argument("configuration", location="json", required=True, help="Configuration cannot be blank."),
    )
    def post(self, user_id, connector_definition_id, name, configuration):
        """ Create a new source """
        
        ###Add Job To Check Connection

        source = ConnectorRepository.create(user_id, connector_definition_id, name, configuration, "source")

        return response({
            "message": "Source created successfully",
            "source": {
                "id": source.id,
                "name": source.name,
                "icon": source.connector_definition.icon,
                "configuration": source.configuration,
            }
        }, 201)

    @token_required
    def get(self, user_id):
        """ Get all sources """

        sources = ConnectorRepository.get_by(connector_type="source",user_id=user_id).all()

        return response({
            "sources": [
                {
                    "id": source.id,
                    "name": source.source_definition.name,
                    "sourceName": source.name,
                    "icon": source.source_definition.icon,
                    "configuration": source.configuration,
                    "default_version_id": source.default_version_id
                } for source in sources
            ]
        }, 200)