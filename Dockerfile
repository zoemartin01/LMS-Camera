FROM node:lts-alpine as build

RUN mkdir -p /app
WORKDIR /app
COPY package*.json /app/

RUN npm install -g typescript
RUN npm ci

COPY . /app

RUN tsc

FROM node:lts-bullseye

RUN mkdir -p /app/output
WORKDIR /app

COPY package*.json /app/
RUN npm ci --only=production

RUN apt-get update && apt-get install -y ffmpeg
COPY --from=build /app/dist /app

EXPOSE 7000
ENTRYPOINT [ "node", "app.js" ]
