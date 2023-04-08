import type { Client } from "discord.js";
import Commands from "../commands/command.js";

export default (client: Client): void => {
	client.on("ready", () => {
		if (!client.user || !client.application) {
			return;
		}

		console.log(`${client.user.username} est en ligne`);

		/*client.application.commands
			.set(Commands)
			.then((col) => {
				console.log(`Commande(s) (/) enregistrée(s) : ${col.size}`);
			})
			.catch(console.error);*/
	});
};
