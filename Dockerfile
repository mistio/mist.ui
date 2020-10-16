FROM node:12.16.3-alpine
LABEL maintainer="support@mist.io"

RUN apk add --update --no-cache git nginx && npm update && npm install -g -U --no-optional polymer-cli prpl-server es-dev-server rollup --unsafe-perm

COPY . /ui
WORKDIR /ui
COPY ./container/nginx.conf /etc/nginx/nginx.conf

RUN npm install && npm run build && cd build/bundled && ln -s /ui/assets && cd -
COPY ./container/entry.sh /entry.sh
RUN cp package.json /

EXPOSE 80 8000

ENTRYPOINT [ "/entry.sh" ]
