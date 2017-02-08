#!/usr/bin/env bash

if [[ "$1" != "" ]]; then
	PLATFORM="--platform=$1"
fi

npm install &&
	electron-packager . \
		--out=builds \
		--version=$(electron --version | tr -d v) \
		--icon="images/app-icon.icns" \
		--overwrite \
		${PLATFORM}
