#!/bin/sh

cd /ui
if ! diff -q package.json /package.json; then
    echo "package.json changed"
    echo "Running npm install"
    npm install
fi

es-dev-server --host 0.0.0.0 --port 8000 --event-stream false --node-resolve --compatibility none &
exec nginx
