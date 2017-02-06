#!/usr/bin/env bash

fin vm stop
# delete pid file to signal to the app that script has finished
rm -f "/tmp/pid.docksal.stopvm"

echo
echo "Press Enter to close this window..."
read -p ''

exit
