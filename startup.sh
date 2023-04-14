# Make sure the .env file exists
ENV_FILE=.env

shopt -s expand_aliases
alias displaycontent="cat $ENV_FILE"

if [ ! -f "$ENV_FILE" ]; then
    printf "Le fichier $ENV_FILE \e[0;41mn\'existe pas !\e[0m\n"
    printf "Entrez le token du bot Discord\n"
    read TOKEN
    if test -f "$ENV_FILE"; then
        printf "Le fichier $ENV_FILE a déjà été créé !"
        exit 1
    fi
    touch "$ENV_FILE"
    echo "TOKEN=$TOKEN" >> "$ENV_FILE"
    echo "Le fichier $ENV_FILE "$'\e[0;102m'a été créé !$'\e[0m'
    printf "\nRécapitulatif $ENV_FILE :\n"
    displaycontent
fi

# Sync the files with the repo
echo $'\e[0;92m'Synchronisation des fichiers avec le repository$'\e[0m'

git reset --hard
git pull

# Install node_modules in case it is missing
echo Installation des $'\e[1;96m'dépendances$'\e[0m'

npm install --production

# Print outdated packages
echo Liste des dépendances $'\e[0;101m'obsolètes$'\e[0m' :

npm outdated

# Startup sequence
npm run start:build