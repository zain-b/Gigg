@echo off

title Gigg dev build

echo.
echo [ Building/compiling angular client... ]
echo.

cd ./client
call ng build --prod --output-hashing none

echo.
echo [ Starting server... ] 
echo.

cd ../server
call set DEBUG=gigg-server:* & node ./bin/www"

pause

