FROM node:6.13.1-alpine
MAINTAINER mist.io <support@mist.io>

RUN apk add --update --no-cache git nginx

RUN npm update && npm install -g -U --no-optional polymer-cli@1.6.0 bower --unsafe-perm

ENV bower_allow_root=true \
    bower_interactive= \
    GIT_DIR=

WORKDIR /ui

COPY bower.json /ui/bower.json

RUN bower install

RUN cp bower.json /

COPY . /ui

RUN node --max_old_space_size=4096 /usr/local/bin/polymer build && cp bower_components/echarts/dist/echarts.common.min.js bower_components/echarts/dist/echarts.min.js build/bundled/bower_components/echarts/dist/ 

COPY ./container/nginx.conf /etc/nginx/nginx.conf

COPY ./container/entry.sh /entry.sh

RUN cd /ui/build && ln -s /ui/assets/ /ui/build/bundled/ && \
    ln -s /ui/assets/ /ui/build/

EXPOSE 80
