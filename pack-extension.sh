#!/usr/bin/env bash

rm -rf ./dist
NODE_ENV=production node_modules/.bin/webpack -p

echo "Manually removing 'localhost:8100' from the manifest.json"
# This is savage.
sed '/localhost:8100/d' manifest.json > ./dist/manifest.json

cp icons/* ./dist
cp popup.html ./dist
cp -r _locales ./dist
cd ./dist
zip extension.zip * _locales/*/*.json

cd ..
./update-binaries.sh
