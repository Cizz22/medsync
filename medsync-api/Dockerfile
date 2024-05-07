FROM node:alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /medsync/api

COPY package.json .

RUN pnpm install

COPY . .

RUN pnpx prisma generate


