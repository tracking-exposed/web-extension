#!/usr/bin/env bash

rm -rf ./dist
NODE_ENV=production node_modules/.bin/webpack -p

echo "Manually removing 'localhost:8000' from the manifest.json"
# This is savage.
sed '/localhost:8000/d' manifest.json > ./dist/manifest.json

cp icons/* ./dist
cp popup.html ./dist
cd ./dist
zip extension.zip *

