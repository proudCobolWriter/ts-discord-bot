// Makes sure all .env variable(s) are specified //

if ("TOKEN" in process.env === false || process.env.TOKEN === "") {
	throw new Error("Un Token doit être spécifié afin que le bot puisse se connecter");
}
