# Sync the files with the repo
echo "Synchronisation des fichiers avec le \033[0;31mrepository\033[0m"

git reset --hard
git fetch
git pull

# Install node_modules in case it is missing
echo "Installation des \033[0;31mdépendances\033[0m"

npm install

# Print outdated packages
echo "LISTE DES \033[0;31mDEPENDANCES\033[0m OBSOLETES:"
npm outdated

# Startup sequence
npm run start:build