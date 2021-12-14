FROM node:lts-bullseye as build

WORKDIR /app
COPY ./ /app

RUN apt-get update && apt-get install -y at
RUN service atd start

RUN npm install

EXPOSE 7000
ENTRYPOINT [ "npx", "ts-node", "src/app.ts" ]
