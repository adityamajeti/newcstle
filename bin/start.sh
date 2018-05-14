#!/bin/sh
cd "../src"
currentdir=`pwd`
npm install
pm2 stop atlantisGateway
pm2 delete atlantisGateway
pm2 flush
pm2 start process.json --env dev
exit;