
import asyncio

from temporalio.client import Client
from temporalio.worker import Worker

from temporal.background_check.activities.ssh_trace_activity import ssn_trace_activity
from temporal.background_check.workflows.background_check_workflow import BackgroundCheck

async def main():
    client = await Client.connect(
        "localhost:7233"  # The IP address of the Temporal Server on your network.
    )

    result = await client.execute_workflow(
        BackgroundCheck,
        "123-45-6789",
        id="background-check-workflow",
        task_queue="background-check",
    )
    
    print(result)

if __name__ == "__main__":
    asyncio.run(main())