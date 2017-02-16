# Docksal UI

These aren't the droids you're looking for...

## Requirements

Runs on:

- macOS 10.12+
- Windows 7+
- Ubuntu 14.04

## Running from sources

Install electron globally
```
npm install electron -g
```

Run
```
electron .
```

## Compiling

Compiling instructions for macOS 10.12+

### Compiling native platform version

Install [electron-packager](https://github.com/electron-userland/electron-packager) globally
```
npm install electron-packager -g
```

Run
```
./build-app.sh
```

### Compiling win32 version on macOS

1\. Install/update XCode to the latest version (takes a while).

2\. Install [Homebrew](http://brew.sh/)

3\. Install wine  (takes a while)
```
brew install wine
```

4\. Run
```
./build-app.sh win32
```

### Compiling Ubuntu version on macOS

```
./build-app.sh linux
```
