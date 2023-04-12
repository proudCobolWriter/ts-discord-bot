// Makes sure all .env variables are specified //

if ("TOKEN" in process.env === false || process.env.TOKEN === "") {
	throw new Error("Un Token doit être spécifié");
}

if (
	"VOICE_CHANNELS_IDS" in process.env === false ||
	process.env.VOICE_CHANNELS_IDS === ""
) {
	throw new Error("Canaux vocaux non spécifiés");
}

if ("ROLE_ID" in process.env === false || process.env.ROLE_ID === "") {
	throw new Error("Rôle non spécifié");
}

if ("GUILD_ID" in process.env === false || process.env.GUILD_ID === "") {
	throw new Error("Serveur Discord non spécifié");
}
