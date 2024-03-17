## Python Base Image for all project

FROM python:3.12

ARG DOCKER_BUILD_ARCH=amd64

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*