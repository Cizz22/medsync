from flask_restful import Resource
from flask_restful.reqparse import Argument
from utils import parse_params, response, create_token, token_required
from repositories import ConnectorDefinitionRepository


class SourceDefinitionsResource:
    """"Source Definition resource"""
    
    def get(self):
        """Get all source definitions"""
        source_definitions = ConnectorDefinitionRepository.get_all()
        
        return response({
            "message": "Source Definitions retrieved successfully",
            "data": [
                {
                "id": source_definition.id,
                "name": source_definition.name,
                "icon": source_definition.icon,
                "docker_repository": source_definition.connector_specifications
        .docker_repository,
                "docker_image_tag": source_definition.connector_specifications
        .docker_image_tag,    
                "documentation_url": source_definition.connector_specifications
        .documentation_url,
                "source_type": source_definition.source_type,
                "icon_url": source_definition.icon_url,
                "created_at": source_definition.created_at,
                } for source_definition in source_definitions
            ]
        }, 200)
    

class SourceDefinitionResource(Resource):
    """"Source Definition resource"""
    
    @parse_params(
        Argument("source_definition_id", location="query", required=True, help="Source Definition ID cannot be blank."),
    )
    def get(self, source_definition_id):
        """Get a source definition"""
        source_definition = ConnectorDefinitionRepository.get_by_id(source_definition_id)
        source_definition_spec = source_definition.connector_specifications
        
        if source_definition is None:
            return response({"message": "Source Definition not found"}, 404)
        
        return response({
            "success":True
            "message": "Source Definition retrieved successfully",
            "data": {
                "id": source_definition.id,
                "name": source_definition.name,
                "icon": source_definition.icon,
                "docker_repository": source_definition_spec.docker_repository,
                "docker_image_tag": source_definition_spec.docker_image_tag,    
                "documentation_url": source_definition_spec.documentation_url,
                "source_type": source_definition.source_type,
                "spec": source_definition.spec,
                "icon_url": source_definition.icon_url,
                "created_at": source_definition.created_at,
            }
        }, 200)
