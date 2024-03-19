from flask_restful import Resource
from flask_restful.reqparse import Argument
from utils import parse_params, response, create_token, token_required
from repositories import ConnectorRepository

class SourceResource(Resource):
    """ Source resource """

    @token_required
    @parse_params(
        Argument("connector_definition_id", location="json", required=True, help="Connector Definition ID cannot be blank."),
        Argument("name", location="json", required=True, help="Name cannot be blank."),
        Argument("configuration", location="json", required=True, help="Configuration cannot be blank."),
    )
    def post(self, name, type, configuration, default_version_id):
        """ Create a new source """

        source = ConnectorRepository.create(
            name = name,
            connector_definition_id = connector_definition_id,
            configuration = configuration,
            user_id=user_id
            
        )

        return response({
            "id": source.id,
            "name": source.name,
            "type": source.type,
            "configuration": source.configuration,
            "default_version_id": source.default_version_id
        }, 201)

    def get(self):
        """ Get all sources """

        sources = ConnectorRepository.get_all()

        return response({
            "sources": [
                {
                    "id": source.id,
                    "name": source.name,
                    "type": source.type,
                    "configuration": source.configuration,
                    "default_version_id": source.default_version_id
                } for source in sources
            ]
        }, 200)