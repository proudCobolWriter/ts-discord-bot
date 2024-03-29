#!/bin/bash
CUR_DIR=${PWD##*/}
CUR_DIR=${CUR_DIR:-/}
BOT_FOLDER=ts-discord-bot

if [[ ! "$CUR_DIR" == *"$BOT_FOLDER"* ]]; then
    cd "./$BOT_FOLDER/"
    echo "# Dossier changé à $BOT_FOLDER"
fi

# Make sure the .env file exists

ENV_FILE=.env
CONFIG_FILE=config.ts
DEFAULT_CONFIG_FILE=config-default.ts
RESTART_DURATION_SECS=5
RUN_ARG=""
CHANGED=false

shopt -s expand_aliases
alias displaycontent="cat $ENV_FILE"

if [ ! -f "$ENV_FILE" ]; then
    printf "# Le fichier $ENV_FILE \e[0;41mn\'existe pas !\e[0m\n"
    printf "# Entrez le token du bot Discord\n"
    read TOKEN
    if test -f "$ENV_FILE"; then
        printf "# Le fichier $ENV_FILE a déjà été créé !"
        exit 1
    fi
    touch "$ENV_FILE"
    echo "TOKEN=$TOKEN" >> "$ENV_FILE"
    printf "# Le fichier $ENV_FILE \e[0;102ma été créé\e[0m !\n"
    sleep 1
    printf "# Récapitulatif $ENV_FILE :\n"
    sleep 1
    displaycontent
fi

if [ ! -f "$CONFIG_FILE" ]; then
    cp "$DEFAULT_CONFIG_FILE" "$CONFIG_FILE"
    sed "1d" "$CONFIG_FILE" > tmpfile; mv tmpfile "$CONFIG_FILE"
    printf "\n# Le fichier $CONFIG_FILE \e[0;102ma été créé\e[0m !\n"
fi

# Typescript transpilation

printf "# \e[1;31mTranspilation\e[0m en cours\n"

if [[ $(git status -z | cut -z -b 2 | tr -d '[:space:]\000') ]]; then
    CHANGED=true
    npx tsc --build
fi

# Sync the files with the repo

printf "# Synchronisation des fichiers avec le \e[0;92mrépertoire Git\e[0m\n"

git reset --hard
git pull

# Install node_modules in case it is missing

printf "# Installation des \e[1;96mdépendances\e[0m\n"

npm install

# Print outdated packages

printf "# Liste des dépendances \e[0;101mobsolètes\e[0m :\n"

npm outdated

# Startup sequence and auto-restart

base64 -d <<<"CiMgICAgICBfX19fX18gICAgICBfXyAgICAgICAgICAgICBfXyAgXyAgICAgICAgICAgCiMgICAgIC8gX19fXy8gIF9fXy9fLyBfX19fX19fICBfXy8gL18oXylfX18gIF9fX18gCiMgICAgLyBfXy8gfCB8L18vIF8gXC8gX19fLyAvIC8gLyBfXy8gLyBfXyBcLyBfXyBcCiMgICAvIC9fX19fPiAgPC8gIF9fLyAvX18vIC9fLyAvIC9fLyAvIC9fLyAvIC8gLyAvCiMgIC9fX19fXy9fL3xffFxfX18vXF9fXy9cX18sXy9cX18vXy9cX19fXy9fLyAvXy8gCiMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCg==" | gunzip -cf

read -t 5 -r -p "# Déployer les commandes ? [o/N] " response
case "$response" in
    [oO][uU][iI]|[oO]) 
        RUN_ARG=--deploy
        ;;
    *)
        if [ -z "$response" ]; then
            echo "non"
        fi
        ;;
esac

until NODE_OPTIONS=--no-warnings NODE_ENV=production node ./dist/src/main.js "$RUN_ARG"; do
    echo -e "Le processus s'est fermé avec le code de sortie $?." >&2
    start="$(($(date +%s) + $RESTART_DURATION_SECS))"
    while [ "$start" -ge `date +%s` ]; do
        time="$(( $start - `date +%s` ))"
        printf '%s\r'"Relancement dans "$(date -u -d "@$time" +%M:%S)" seconde(s)..."
    done
done