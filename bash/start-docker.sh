#!/usr/bin/env bash

echo service docker start
service docker start
# delete pid file to signal to the app that script has finished
rm -f "/tmp/pid.docksal.startvm"

echo
echo "Press Enter to close this window..."
read -p ''

exit
