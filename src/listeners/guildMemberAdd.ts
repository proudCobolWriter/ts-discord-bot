import { Events, type Client, ChannelType, type APIEmbed } from "discord.js";

import config from "../../config.js";

const enabled =
	config.welcomeMessageSettings.enable &&
	config.welcomeMessageSettings.messages.length > 0;

const timeout = (s: number): Promise<void> =>
	new Promise((resolve) => setTimeout(resolve, s * 1000));

export default (client: Client): void => {
	client.on(Events.GuildMemberAdd, async (member) => {
		if (!enabled || member.user.bot) return;

		const messages = config.welcomeMessageSettings.messages;
		const welcomeMessage = messages.find(
			(message) => message.guild === member.guild.id
		);
		if (!welcomeMessage) return;

		const guild = client.guilds.cache.get(welcomeMessage.guild);
		if (!guild) return;

		const channel = guild.channels.cache.get(welcomeMessage.channel);
		if (!channel || channel.type !== ChannelType.GuildText) return;

		try {
			if (welcomeMessage.typingDuration && welcomeMessage.typingDuration > 0)
				await Promise.all([
					channel.sendTyping(),
					timeout(welcomeMessage.typingDuration),
				]);
			await channel.send({
				embeds: JSON.parse(
					JSON.stringify(welcomeMessage.embeds).replaceAll(
						"%tag_user%",
						"<@!" + member.user.id + ">"
					)
				) as APIEmbed[],
			});

			console.log(
				`${member.user.tag} a rejoint : Message de bienvenue envoyé dans le salon ${channel.name}`
			);
		} catch (err) {
			console.log(
				`Une erreur est survenue lors de l'envoi du message de bienvenue sur le serveur ${guild.name} :`
			);
			console.error(err);
		}
	});
};
