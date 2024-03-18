from flask_restful import Resource
from flask_restful.reqparse import Argument
from utils import parse_params, response, create_token
from repositories import SourceRepository 


class SourceResource(Resource):
    """ Source resource """

    @parse_params(
        Argument("name", location="json", required=True, help="Name cannot be blank."),
        Argument("type", location="json", required=True, help="Type cannot be blank."),
        Argument("configuration", location="json", required=True, help="Configuration cannot be blank."),
        Argument("default_version_id", location="json", required=True, help="Default version id cannot be blank."),
    )
    def post(self, name, type, configuration, default_version_id):
        """ Create a new source """

        source = SourceRepository.create(name, type, configuration, default_version_id)

        return response({
            "id": source.id,
            "name": source.name,
            "type": source.type,
            "configuration": source.configuration,
            "default_version_id": source.default_version_id
        }, 201)

    def get(self):
        """ Get all sources """

        sources = SourceRepository.get_all()

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