#!/bin/bash
set -e
set -x
if [[ "$(uname -s)" == 'Darwin' ]]; then
	DARWIN=true
else
	DARWIN=false
fi

if [[ "$DARWIN" = true ]]; then
	brew update
	brew install haxe
else
	export DISPLAY=:99.0
	sh -e /etc/init.d/xvfb start
	sudo add-apt-repository ppa:eyecreate/haxe -y
	sudo apt-get update -y
	sudo apt-get install haxe -y
fi

mkdir -p ~/.haxe/lib
mkdir -p bin
echo ~/.haxe/lib | haxelib setup
haxelib install hamcrest || true
haxelib install hxcpp || true
haxelib install munit || true
haxelib install mcover || true
haxelib install promhx || true