#!/bin/sh

cd /ui
if ! diff -q package.json /package.json; then
    echo "package.json changed"
    echo "Running npm install"
    npm install
fi

polymer serve --npm -H 0.0.0.0 -p 8000 --compile=always &

exec nginx