"""
Defines the blueprint for the source definition
"""
from flask import Blueprint
from flask_restful import Api

from src.resources import SourceDefinitionsResource, SourceDefinitionResource

SOURCE_DEFINITION_BLUEPRINT = Blueprint("source_definition", __name__)

Api(SOURCE_DEFINITION_BLUEPRINT).add_resource(
    SourceDefinitionsResource, "/source-definition"
)

Api(SOURCE_DEFINITION_BLUEPRINT).add_resource(
    SourceDefinitionResource, "/source-definition/<source_definition_id>"
)