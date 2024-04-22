FROM python:3.12-slim-bullseye

ARG DOCKER_BUILD_ARCH=amd64

WORKDIR /medsync/api

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 5000

ENV APPLICATION medsync-api

COPY . /medsync/api

RUN pip install -r requirements.txt --user --upgrade --no-warn-script-location --no-cache-dir
