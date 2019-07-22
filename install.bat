@echo off

title Gigg dev installation  

echo.
echo [ Installing server NPM modules... ]
echo.

cd ./server
call npm install

echo.
echo [ Installing client NPM modules... ] 
echo.

cd ../client
call npm install

echo.
echo [ Done! Now run the build-client-run-server script... ]
echo.

pause

