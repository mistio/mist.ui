FROM node:6.9.1-alpine
MAINTAINER mist.io <support@mist.io>

RUN apk add --no-cache git nginx

ADD . /ui

WORKDIR /ui

RUN npm install && npm install polymer-cli bower grunt

RUN node node_modules/bower/bin/bower install --config.interactive=false --allow-root && \
    cd bower_components && rm -rf c3-chart polyana-dashboard timerange-picker vaadin-grid && \
    ln -s ../mist_components/vaadin-grid && ln -s ../mist_components/timerange-picker && ln -s ../mist_components/polyana-dashboard && \
    cd /ui && node --max_old_space_size=4096 node_modules/polymer-cli/bin/polymer.js build

COPY ./container/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

ENTRYPOINT nginx
