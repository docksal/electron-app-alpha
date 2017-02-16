#!/usr/bin/env bash

## PLATFORM:
##  use win32 for Windows
##  darwin for macOS
##  linux for Linux
##  leave empty to build app for platform you're running at

if [[ "$1" != "" ]]; then
	PLATFORM="--platform=$1"
fi

[[ "$1" == "" ]] &&
	echo "Building Docksal UI for current platform" ||
	echo "Building app for $1 platform"
echo "Press Enter to continue..."
read -p ''

npm install &&
	electron-packager . \
		--out=builds \
		--version=$(electron --version | tr -d v) \
		--icon="images/app-icon.icns" \
		--overwrite \
		${PLATFORM}
