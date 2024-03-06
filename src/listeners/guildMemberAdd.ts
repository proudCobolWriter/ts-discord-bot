import { Events, type Client, ChannelType } from "discord.js";

import config from "../../config.js";

const enabled =
	config.welcomeMessageSettings.enable &&
	config.welcomeMessageSettings.messages.length > 0;

const timeout = (s: number): Promise<void> =>
	new Promise((resolve) => setTimeout(resolve, s * 1000));

export default (client: Client): void => {
	client.on(Events.GuildMemberAdd, async (member): Promise<void> => {
		if (!enabled || member.user.bot) return;

		const messages = config.welcomeMessageSettings.messages;
		const welcomeMessage = messages.find(
			(message) => message.guild === member.guild.id,
		);
		if (!welcomeMessage) return;

		const guild = client.guilds.cache.get(welcomeMessage.guild);
		if (!guild) return;

		try {
			const channel = await guild.channels.fetch(welcomeMessage.channel);
			if (!channel || channel.type !== ChannelType.GuildText) return;

			if (welcomeMessage.typingDuration && welcomeMessage.typingDuration > 0)
				await Promise.all([
					channel.sendTyping(),
					timeout(welcomeMessage.typingDuration),
				]);

			await channel.send(
				JSON.parse(
					JSON.stringify(welcomeMessage.message).replaceAll(
						"%tag_user%",
						"<@!" + member.user.id + ">",
					),
				),
			);

			console.log(
				`${member.user.tag} a rejoint : Message de bienvenue envoyé dans le salon ${channel.name}`,
			);
		} catch (err) {
			console.log(
				`Une erreur est survenue lors de l'envoi du message de bienvenue sur le serveur ${guild.name} :`,
			);
			console.error(err);
		}
	});
};
