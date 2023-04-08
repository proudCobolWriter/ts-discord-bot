// Retrieving dependencies

import { Client, IntentsBitField } from "discord.js";
import { RateLimiter } from "discord.js-rate-limiter";
import Listeners from "./listeners/index.js";

import path from "path";

// CONSTANTS

const TOKEN = process.env.TOKEN;

// Setting up the intents

const intents = new IntentsBitField();

intents.add(
	IntentsBitField.Flags.GuildVoiceStates,
	IntentsBitField.Flags.Guilds
);

// Setting up the bot

const client = new Client({
	intents,
});

const rateLimiter = new RateLimiter(1, 5e3);

Listeners.forEach(async (file) => {
	const name = path.parse(file).name;

	import(`./listeners/${name}.js`)
		.then((moduleResult) => {
			console.log(`Évènement ${name}.js importé`);
			moduleResult.default(client, rateLimiter);
		})
		.catch((err: Error) => {
			console.error(
				`Une erreur a été rencontrée lors du chargement de ${file} :`
			);
			console.error(err);
		});
});

try {
	await client.login(TOKEN);
} catch (err) {
	console.log(
		"Une erreur a été rencontrée lors de la création de l'instance de bot :"
	);
	console.error(err);
	process.exit(1);
}

export default client;
