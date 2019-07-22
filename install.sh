#!/bin/bash

echo 
echo [ Installing server NPM modules... ]
echo 

cd ./server
npm install | tail -f

echo
echo [ Installing client NPM modules... ] 
echo

cd ../client
npm install | tail -f

echo
echo [ Done! Now run the build-client-run-server script... ]
echo

read -rsp $'Press enter to continue...\n'

