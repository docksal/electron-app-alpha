#!/usr/bin/env bash

if ( fin docker ps --format '{{.Names}}' | grep webui >/dev/null ); then
	rm -f "/tmp/pid.docksal.webui"
	exit
fi

fin docker run -d --name docksal-webui --restart=always --privileged --userns=host \
	--label "io.docksal.group=system" --label "io.docksal.virtual-host=webui.docksal" \
	--env "VIRTUAL_HOST=webui.docksal" \
	-v /:/rootfs:ro -v /var/run:/var/run:rw -v /sys:/sys:ro -v /var/lib/docker/:/var/lib/docker:ro \
	--expose 80 --expose 443 \
	docksal/webui

# delete pid file to signal to the app that script has finished
rm -f "/tmp/pid.docksal.webui"

sleep 3
exit
