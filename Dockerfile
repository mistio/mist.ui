FROM node:6.9.1-alpine
MAINTAINER mist.io <support@mist.io>

RUN apk add --update --no-cache git nginx

RUN npm install -g polymer-cli bower

ADD . /ui

WORKDIR /ui

RUN mkdir -p bower_components && cd bower_components && \
    ln -s ../mist_components/vaadin-grid && \
    ln -s ../mist_components/timerange-picker && \
    ln -s ../mist_components/polyana-dashboard && \
    cd - && bower install --config.interactive=false --allow-root && \
    node --max_old_space_size=4096 /usr/local/bin/polymer build

COPY ./container/nginx.conf /etc/nginx/nginx.conf

COPY ./container/entry.sh /entry.sh

ARG build_tag

ENV BUILD_TAG=$build_tag

RUN cd /ui/build && ln -s . $BUILD_TAG && ln -s /ui/assets/ /ui/build/bundled/ && \
    ln -s /ui/assets/ /ui/build/

EXPOSE 80
