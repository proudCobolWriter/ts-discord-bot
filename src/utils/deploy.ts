import type {
	ApplicationCommand,
	Client,
	Collection,
	GuildResolvable,
} from "discord.js";
import Commands from "../commands/command.js";

export type DeployResult = Collection<
	string,
	ApplicationCommand<{ guild: GuildResolvable }>
>;

export const deploy = (client: Client): Promise<DeployResult> =>
	new Promise((resolve, reject) => {
		client.application?.commands
			.set(Commands)
			.then((col) => {
				resolve(col);
			})
			.catch((err) => {
				console.log(
					"Une erreur est survenue lors de l'enregistrement des commandes (/) :"
				);
				reject(err);
			});
	});
