#!/usr/bin/env bash

if [ -d "../binaries" ]; then
    # yes, I didn't found something like "npm display version"...
    version=`grep version package.json | cut -b 15- | sed -es/..$//`
    echo "developer setup found, ../binaries directory is present"
    expected="web-extension-$version.zip"
    echo "checking $expected"
    dest="../binaries/fbTREX/published/$expected"
    sha256file="../binaries/fbTREX/published/web-extension-$version.sha256"
    if [ ! -e $dest ]; then
        echo "file $dest do not exist, making a copy"
        cp dist/extension.zip $dest
        sha256sum < dist/extension.zip > $sha256file
        ls -l ../binaries/fbTREX/published/*$version*
        echo "changing link on ../binaries/fbTREX/last/web-extension.zip"
        ln -sf ../published/$expected ../binaries/fbTREX/last/web-extension.zip
        ls -l ../binaries/fbTREX/last/*
        echo "You should commit the updated version"
    fi
fi
