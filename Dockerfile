FROM node:lts-bullseye as build

WORKDIR /app
COPY ./ /app

RUN apt-get update && apt-get install -y ffmpeg
RUN mkdir /app/output

RUN npm install

EXPOSE 7000
ENTRYPOINT [ "npx", "ts-node", "src/app.ts" ]
