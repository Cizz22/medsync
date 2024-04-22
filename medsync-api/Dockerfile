FROM node:alpine

WORKDIR /usr/src/node-app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npx prisma generate


