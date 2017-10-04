FROM node:6.9.1-alpine
MAINTAINER mist.io <support@mist.io>

RUN apk add --update --no-cache git nginx

RUN npm install -g polymer-cli bower gulp

ENV bower_allow_root=true \
    bower_interactive= \
    GIT_DIR=

WORKDIR /ui

COPY bower.json /ui/bower.json

RUN bower install

COPY . /ui

RUN node --max_old_space_size=4096 /usr/local/bin/polymer build

COPY ./container/nginx.conf /etc/nginx/nginx.conf

COPY ./container/entry.sh /entry.sh

RUN cd /ui/build && ln -s /ui/assets/ /ui/build/bundled/ && \
    ln -s /ui/assets/ /ui/build/

EXPOSE 80
