# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 as base

WORKDIR /medsync/api

COPY package.json .

RUN bun install

COPY . .

RUN bunx prisma generate

RUN bun run build




