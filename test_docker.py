import docker


def test_docker():

    client = docker.from_env()

    # Run the container
    container = client.containers.run(
        "airbyte/source-postgres", detach=True, command="spec")

    # Wait for the container to finish running
    container.wait()

    # Get the logs of the container
    logs = container.logs().decode('utf-8')

    # Print or process the logs
    print(logs)

    # Remove the container if needed
    container.remove()


test_docker()
