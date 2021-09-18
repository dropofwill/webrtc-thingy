FROM node

RUN mkdir -p /app/client

COPY \
  package.json \
  package-lock.json \
  /app

COPY \
  client/package.json \
  client/package-lock.json \
  /app/client

WORKDIR /app/client
RUN npm install && npm install -g parcel

COPY \
  server.js \
  /app

COPY \
  client/host.js \
  client/host.html \
  client/index.js \
  client/index.html \
  /app/client

RUN parcel build host.html && parcel build index.html

WORKDIR /app
RUN npm install

EXPOSE 8080
CMD ["npm", "start"]
