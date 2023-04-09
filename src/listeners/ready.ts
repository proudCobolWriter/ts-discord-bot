import type { Client } from "discord.js";
import type { DeployResult } from "../utils/deploy.js";
import { deploy } from "../utils/deploy.js";

export default (client: Client): void => {
	client.on("ready", () => {
		if (!client.user || !client.application) {
			return;
		}

		console.log(`${client.user.username} est en ligne`);

		deploy(client)
			.then((col) => {
				console.log(
					`Commande(s) (/) enregistrée(s) : ${
						(col as DeployResult).size
					}`
				);
			})
			.catch(console.error);
	});
};
