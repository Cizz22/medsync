from src.utils import run_docker
from temporalio import activity

@activity.defn(name="spec")
def spec(image):
    return run_docker(image, "spec")
