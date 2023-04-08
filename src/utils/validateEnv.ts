// Makes sure all .env variables are specified //

if ("TOKEN" in process.env === false) {
	throw new Error("Un Token doit être spécifié");
}

if ("VOICE_CHANNELS_IDS" in process.env === false) {
	throw new Error("Canaux vocaux non spécifiés");
}

if ("ROLE_ID" in process.env === false) {
	throw new Error("Rôle non spécifié");
}

if ("GUILD_ID" in process.env === false) {
	throw new Error("Serveur Discord non spécifié");
}

// TODO: print all possible .env variables
