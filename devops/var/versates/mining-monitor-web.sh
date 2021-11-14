#!/bin/sh

PATH="$PATH:/home/inacio/.nvm/versions/node/v6.11.2/bin"
DIR=/var/versates
APP=mining-monitor-web
export PATH

cd $DIR/$APP
nohup ng serve --prod --host 172.0.0.1 --port 80 --disable-host-check > $DIR/logs/$APP.log &

