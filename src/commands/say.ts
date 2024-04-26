// Imported from javascript, don't have the time to check for all the errors rn
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { type CommandInteraction, type Client, ApplicationCommandType } from "discord.js";

import type { Command } from "./command.js";
import lang from "../../lang/commands.json" assert { type: "json" };

const timeout = (s: number) => new Promise((resolve) => setTimeout(resolve, s * 1000));

export const say: Command = {
	name: "say",
	nameLocalizations: lang.say.nameLocalizations,
	description: "Sends a custom message (admin only)",
	descriptionLocalizations: lang.say.descriptionLocalizations,
	type: ApplicationCommandType.ChatInput,
	dmPermission: true,
	options: [
		{
			name: "message",
			description: "the message you want to be sent",
			type: 3,
			required: true,
		},
		{
			name: "channel",
			description: "the channel where you want the message to be sent",
			type: 7,
			required: false,
			channel_types: [0],
		},
		{
			name: "attachment",
			description: "the attachment you want to send",
			type: 11,
			required: false,
		},
		{
			name: "reply",
			description:
				"the message you want the bot to reply to. You must have Dev Tools enabled to copy the message ID",
			type: 3,
			required: false,
		},
	],
	run: async (client: Client, interaction: CommandInteraction) => {
		await interaction.deferReply({ ephemeral: true });

		if (!interaction.member) return;

		const isMemberAdmin = interaction.member
			.permissionsIn(interaction.channel)
			.has("ADMINISTRATOR");

		if (!isMemberAdmin) {
			interaction
				.followUp(
					"You need the __**ADMINISTRATOR**__ permission to use this command!",
				)
				.catch(console.error);
			return;
		}

		const options = interaction.options.data;
		let channelOption = options[1];

		if (channelOption && channelOption.name === "channel") {
			channelOption = channelOption.channel;
		} else {
			channelOption = interaction.channel;
		}

		const messageToReply = options.find((x) => x.name === "reply");

		try {
			const canSendMsg = client.guilds.cache
				.get(interaction.channel.guildId)
				.members.me.permissionsIn(channelOption.id)
				.has("SEND_MESSAGES");

			if (!canSendMsg)
				throw new Error(
					`No send/read permissions in channel ${channelOption.name}`,
				);

			const attachment = interaction.options.getAttachment("attachment");
			const messageContent = {
				content: (options[0].value as string).replaceAll("\\n", "\n"),
			};

			if (attachment) {
				messageContent.files = [
					{
						attachment: attachment.url,
						name: attachment.name,
						description: "Sent from the bot",
					},
				];
			}

			channelOption.sendTyping();

			await timeout(3);

			if (messageToReply) {
				try {
					const invalidSnowflake = !/^\d*$/.test(messageToReply.value);

					if (invalidSnowflake) {
						interaction
							.followUp(
								"The message ID you provided is invalid! It must be a valid Discord snowflake containing numbers. Make sure to enable the Dev Tools to get that.",
							)
							.catch(console.error);
					} else {
						const replyToMessage = await channelOption.messages.fetch(
							messageToReply.value,
						);

						replyToMessage.reply(messageContent);
					}
				} catch (err) {
					console.error(err);
					interaction
						.followUp(`Message couldn't be sent!`)
						.catch(console.error);
				}
				return;
			} else {
				channelOption.send(messageContent);
			}

			interaction
				.followUp(`Message successfully sent in ${channelOption.name}!`)
				.catch(console.error);
		} catch (err) {
			console.error(err);
			interaction
				.followUp(`Message couldn't be sent in ${channelOption.name}.`)
				.catch(console.error);
		}
	},
};
