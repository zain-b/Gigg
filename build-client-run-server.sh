echo
echo [ Building/compiling angular client... ]
echo

cd ./client
ng build --prod --output-hashing none

echo
echo [ Starting server... ] 
echo

cd ../server
npm start



