
import asyncio

from temporalio.client import Client
from temporalio.worker import Worker
from temporal.background_check.activities import ssn_trace_activity
from temporal.background_check.workflows import BackgroundCheck

async def main():
    client = await Client.connect("localhost:7233")
    worker = Worker(
        client,
        task_queue="your-task-queue",
        workflows=[BackgroundCheck],
        activities=[ssn_trace_activity],
    )
    await worker.run()


if __name__ == "__main__":
    asyncio.run(main())