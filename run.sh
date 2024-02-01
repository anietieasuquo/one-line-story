echo "One Line Story"
echo "-------------------------------------------"
echo "Installing dependencies"
yarn install || npm install || exit 0
echo "-------------------------------------------"
echo "Starting server and client concurrently"
yarn start || npm start || exit 0
