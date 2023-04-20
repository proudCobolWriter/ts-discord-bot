import { type CommandInteraction, type Client, ApplicationCommandType } from "discord.js";
import type { Command } from "./command.js";

import lang from "../../lang/commands.json" assert { type: "json" };

export const ping: Command = {
	name: "ping",
	nameLocalizations: lang.ping.nameLocalizations,
	description: "Returns my ping",
	descriptionLocalizations: lang.ping.descriptionLocalizations,
	type: ApplicationCommandType.ChatInput,
	dmPermission: true,
	run: async (client: Client, interaction: CommandInteraction) => {
		const message = await interaction.deferReply({
			ephemeral: true,
			fetchReply: true,
		});

		const followUp = await interaction.followUp({
			content: `**${message.createdTimestamp - interaction.createdTimestamp}**ms`,
		});

		setTimeout(() => {
			interaction.deleteReply(followUp.id).catch(console.error);
		}, 20e3);
	},
};
