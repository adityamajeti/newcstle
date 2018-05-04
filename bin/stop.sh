#!/bin/sh
cd "../src"
currentdir=`pwd`
pm2 stop atlantisGateway
pm2 delete atlantisGateway
exit;