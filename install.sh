#!/bin/sh

npm install nlogger
npm install connect-form 
npm install underscore
npm install socket.io

echo '{ "counter": 0 }' > counter.json

mkdir audio

which mp3split
