import type { ApplicationCommand, Client, Collection, GuildResolvable } from "discord.js";
import Commands, { type Command } from "../commands/command.js";
import { updatedDiff as ObjectDifference } from "deep-object-diff";

export type DeployResult =
	| Collection<string, ApplicationCommand<{ guild: GuildResolvable }>>
	| Array<Command>;

export const deploy = async (client: Client): Promise<DeployResult> => {
	if (!client.application) throw new Error("Impossible de trouver client.application");

	const forceDeploy = process.argv.some((argument) => argument === "--deploy");
	const currentClientCommands = await client.application.commands.fetch();
	let commandsChanged = forceDeploy || currentClientCommands.size !== Commands.length;

	if (!commandsChanged) {
		for (const [, value] of currentClientCommands) {
			const command = Commands.find((cmd) => cmd.name === value.name);

			commandsChanged =
				!command || Object.keys(ObjectDifference(command, value)).length > 0;
		}
	}

	return commandsChanged ? client.application.commands.set(Commands) : Commands;
};
