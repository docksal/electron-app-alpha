#!/usr/bin/env bash

fin vm start
# delete pid file to signal to the app that script has finished
rm -f "/tmp/pid.docksal.startvm"

echo
echo "Press Enter to close this window..."
read -p ''

exit
