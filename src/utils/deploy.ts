import type { ApplicationCommand, Client, Collection, GuildResolvable } from "discord.js";
import Commands, { type Command } from "../commands/command.js";

const deployArg = "--deploy";

export type DeployResult =
	| Collection<string, ApplicationCommand<{ guild: GuildResolvable }>>
	| Array<Command>;

export const deploy = async (client: Client): Promise<DeployResult> => {
	if (!client.application) throw new Error("Impossible de trouver client.application");

	const shouldDeploy = process.argv.some((argument) => argument === deployArg);
	if (shouldDeploy) console.log(`Bot lancé avec l'argument ${deployArg}`);

	return shouldDeploy ? client.application.commands.set(Commands) : Commands;
};
