from flask_restful import Resource
from flask_restful.reqparse import Argument
from src.utils import parse_params, response, create_token, token_required
from src.repositories import JobRepository



class JobResources(Resource):
    
    ##Create New Job
    @parse_params(
        Argument("scope", location="json", required=True, help="Scope cannot be blank."),
        Argument("config_type", location="json", required=True, help="Config Type cannot be blank."),
        Argument("config", location="json", required=True, help="Config cannot be blank."),
        Argument("status", location="json", required=True, help="Status cannot be blank."),
    )
    def post(self, scope, config_type, config, status):
        """ Create a new Job """
        
        job = JobRepository.create(
            scope,
            config_type,
            config,
            status
        )
        
        ## Execute temporal job here
        
        return response({
            "message": "Job created successfully",
            "job": {
                "id": job.id,
                "scope": job.scope,
                "config_type": job.config_type,
                "config": job.config,
                "status": job.status
            }
        }, 201)