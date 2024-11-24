FROM docker.io/debian:buster-slim AS build
WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y curl python2 build-essential && rm -rf /var/lib/apt/lists/*

RUN curl https://install.meteor.com/?release=1.3 | sh

COPY .meteor/packages .meteor/versions .meteor/release ./.meteor/

ENV NODE_TLS_REJECT_UNAUTHORIZED=0
RUN meteor list # Maybe you didn't expect the `list` subcommand to install dependencies. In that case, we have something in common.

COPY client client
COPY public public
COPY server server

RUN meteor build /dist --directory
RUN cd /dist/bundle/programs/server && meteor npm install --production

WORKDIR /dist/bundle
CMD ["meteor", "node", "main.js"]
