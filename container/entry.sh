cd /mist.core/src/mist.io/ui
if ! git diff --quiet --exit-code staging bower.json; then
    echo "bower.json changed"
    echo "Running bower install"
    bower install --config.interactive=false --allow-root 
fi

nginx
