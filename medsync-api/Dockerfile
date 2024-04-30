FROM node:alpine

WORKDIR /medsync/api

COPY package.json .

RUN pnpm install

COPY . .

RUN pnpx prisma generate



