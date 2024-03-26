from flask_restful import Resource
from flask_restful.reqparse import Argument
from utils import parse_params, response, create_token, token_required
from repositories import ConnectionRepository

class ConnectionResources(Resource):
    """ Connection resource """

    @token_required
    @parse_params(
        Argument("source_id", location="json", required=True, help="Source ID cannot be blank."),
        Argument("destination_id", location="json", required=True, help="Destination ID cannot be blank."),
        Argument("name", location="json", required=False),
        Argument("configuration", location="json", required=True, help="Configuration cannot be blank."),
        Argument("schedule", location="json", required=False),
        Argument("status", location="json", required=False),
        Argument("catalog_id", location="json", required=False),
        Argument("configurated_catalog", location="json", required=False),
    )
    def post(self, user_id, source_id, destination_id, name, configuration, schedule, status, catalog_id, configurated_catalog):
        """ Create a new connection """
        
        connection_name = name if name else f"Connection {source_id} to {destination_id}"
        
        if(schedule is not None):
            connection_schedule_type = schedule.schedule_type
            connection_schedule_data = {
                "cron": schedule.cron,
                "timezone": schedule.timezone
            }
        else:
            connection_schedule_type = "Manual"

        connection = ConnectionRepository.create(
            source_id, 
            destination_id, 
            connection_name, 
            configurated_catalog, 
            status, 
            configuration,
            catalog_id, 
            connection_schedule_type, 
            connection_schedule_data
            )
        
        ## Populate schedule data
        
        
        ## Start Workflow Sync

        return response({
            "message": "Connection created successfully",
            "connection": {
                "id": connection.id,
                "name": connection_name,
            }
        }, 201)

