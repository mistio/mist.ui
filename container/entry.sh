#!/bin/sh

if [ "$1" = "unison" ];then
    rm -rf /ui
    ln -s /mist.core/src/mist.io/ui /ui 
fi

cd /ui
if ! git diff --quiet --exit-code staging bower.json; then
    echo "bower.json changed"
    echo "Running bower install"
    GIT_DIR= bower install --config.interactive=false --allow-root
fi
cp /ui/container/nginx.conf /etc/nginx/nginx.conf
nginx
