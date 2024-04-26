FROM node:alpine

WORKDIR /medsync/api

COPY package.json .

RUN npm install

COPY . .

RUN npx prisma generate



