#!/bin/bash

npm i

npx tsc --build

path=$(pwd)

command="node ${path}/build/app.js"

echo alias plt="'$command'" >> ~/.bashrc

echo "export MONGO_URL='<Yor MONGO_URL string goes here>'" >> ~/.bashrc