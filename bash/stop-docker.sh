#!/usr/bin/env bash

echo service docker stop
service docker stop
# delete pid file to signal to the app that script has finished
rm -f "/tmp/pid.docksal.stopvm"

echo
echo "Press Enter to close this window..."
read -p ''

exit
