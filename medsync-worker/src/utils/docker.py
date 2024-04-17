import docker


def run_docker(image, command):
    client = docker.from_env()

    # Run the container
    container = client.containers.run(
        image, detach=True, command=command)

    container.wait()

    logs = container.logs()

    container.remove()

    return logs


def run_docker_with_params(image, command, params):
    client = docker.from_env()

    # Example params
    # --config /path/to/config --output /path/to/output
    # params = {
    #     config: "/path/to/config",
    #     output: "/path/to/output"
    # }

    container = client.containers.run(
        image, detach=True, command=command, **params)
