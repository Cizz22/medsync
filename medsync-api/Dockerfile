FROM python:3.12

ARG DOCKER_BUILD_ARCH=amd64

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 5000

ENV APPLICATION medsync-api

COPY . /app

## Run Python app
CMD ["python", "src/app.py"]