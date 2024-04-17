from temporalio import workflow
from activity import spec


@workflow.defn(name="spec")
class Spec:
    @workflow.run
    async def run(self, image: str) -> str:
        return await workflow.execute_activity(
            spec,
            image,
        )
