default: help

TEMPORAL_COMPOSE = medsync-temporal/docker-compose.yml
PROD_COMPOSE = medsync-compose/docker-compose.prod.yml
DEV_COMPOSE = docker-compose.yml
DEV_BUILD_COMPOSE = docker-compose.build.yml

# Build the docker image
build: docker compose -f $(DEV_BUILD_COMPOSE) build
.PHONY: build

compose-up:
	docker compose -f ${TEMPORAL_COMPOSE} up -d
	docker-compose -f $(PROD_COMPOSE) up -d
.PHONY: compose-up

compose-down:
	docker compose -f ${TEMPORAL_COMPOSE} down
	docker-compose -f $(DEV_COMPOSE) down
.PHONY: compose-down