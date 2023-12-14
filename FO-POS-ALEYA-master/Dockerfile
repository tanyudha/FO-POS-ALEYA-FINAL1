# Dockerfile
FROM node:14.4.0-alpine3.11 as build

# create destination directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ADD package.json yarn.lock ./

# copy the app, note .dockerignore
COPY . /usr/src/app/
RUN yarn install --silent
RUN yarn build

EXPOSE 3001

ENV NODE_ENV production
ENV NUXT_HOST 0.0.0.0
ENV NUXT_PORT 3001

CMD [ "yarn", "start" ]