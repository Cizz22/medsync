"""
Defines the blueprint for the source 
"""
from flask import Blueprint
from flask_restful import Api

from src.resources import SourceResources

SOURCE_BLUEPRINT = Blueprint("source", __name__)

Api(SOURCE_BLUEPRINT).add_resource(
    SourceResources, "/source"
)