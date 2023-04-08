import {
	type CommandInteraction,
	type Client,
	ApplicationCommandType,
} from "discord.js";
import type { Command } from "./command.js";

/**
 * @type {import("./command.js").Command}
 */
export const about: Command = {
	name: "hello",
	description: "returns a greeting",
	type: ApplicationCommandType.ChatInput,
	dmPermission: true,
	run: async (client: Client, interaction: CommandInteraction) => {
		const content = "hello there!";

		await interaction.followUp({
			content,
		});
	},
};
