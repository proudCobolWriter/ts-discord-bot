import {
	type CommandInteraction,
	type Client,
	ApplicationCommandType,
} from "discord.js";
import type { Command } from "./command.js";

/**
 * @type {import("./command.js").Command}
 */
export const ping: Command = {
	name: "ping",
	description: "Returns my ping",
	type: ApplicationCommandType.ChatInput,
	dmPermission: true,
	run: async (client: Client, interaction: CommandInteraction) => {
		const message = await interaction.deferReply({
			ephemeral: true,
			fetchReply: true,
		});

		const followUp = await interaction.followUp({
			content: `**${
				message.createdTimestamp - interaction.createdTimestamp
			}**ms`,
		});

		setTimeout(() => {
			interaction.deleteReply(followUp.id).catch(console.error);
		}, 20e3);
	},
};
