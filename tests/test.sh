ENV_FILE=.env

shopt -s expand_aliases
alias displaycontent="cat $ENV_FILE"

if [ ! -f "$ENV_FILE" ]; then

    printf "Le fichier $ENV_FILE \e[0;41mn\'existe pas !\e[0m\n"
    printf "Entrez le token du bot Discord\n"
    read TOKEN
    printf "Indiquez l'ID du serveur Discord\n"
    read GUILD
    printf "Indiquez l'ID du canal vocal où le rôle sera donné aux membres (plusieurs salons vocaux peuvent être indiqués en séparant les IDs par une virgule)\n"
    read CHANNEL
    printf "Indiquez l'ID du rôle qui est donné aux membres lorsqu'ils se connectent au(x) can(aux)al voc(aux)al que vous venez de specifier\n"
    read ROLE
    if test -f "$ENV_FILE"; then
        printf "\e[0;41mLe fichier $ENV_FILE a déjà été créé !\e[0m\n"
        exit 1
    fi
    touch "$ENV_FILE"
    echo "TOKEN=$TOKEN" >> "$ENV_FILE"
    echo "GUILD_ID=$GUILD" >> "$ENV_FILE"
    echo "VOICE_CHANNELS_IDS=$CHANNEL" >> "$ENV_FILE"
    echo "ROLE_ID=$ROLE" >> "$ENV_FILE"
    echo "Le fichier $ENV_FILE "$'\e[0;102m'a été créé !$'\e[0m'
    printf "\nRécapitulatif $ENV_FILE :\n"
    displaycontent
fi