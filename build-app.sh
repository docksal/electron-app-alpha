#!/usr/bin/env bash

npm install &&
electron-packager . --out=builds --version=$(electron --version | tr -d v) --icon="images/app-icon.icns" --overwrite
