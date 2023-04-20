import { Events, type Client } from "discord.js";
import type { DeployResult } from "../utils/deploy.js";
import { deploy } from "../utils/deploy.js";

export default (client: Client): void => {
	client.on(Events.ClientReady, (): void => {
		if (!client.user || !client.application) {
			return;
		}

		console.log(`${client.user.username} est en ligne`);

		deploy(client)
			.then((result: DeployResult) => {
				console.log(
					`Commande(s) (/) trouvée(s) : ${
						Array.isArray(result) ? result.length : result.size
					}`
				);
			})
			.catch((err) => {
				console.log(
					"Une erreur est survenue lors de l'enregistrement des commandes (/) :"
				);
				console.error(err);
			});
	});
};
