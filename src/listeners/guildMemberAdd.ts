import { EmbedBuilder, Events, type Client, ChannelType } from "discord.js";

const timeout = (s: number): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, s * 1000));
};

export default (client: Client): void => {
	client.on(Events.GuildMemberAdd, async (member) => {
		//if (member.user.bot) return;
		console.log(member.user.bot);
		if (member.guild.id === process.env.GUILD_ID && process.env.WELCOME_CHANNEL_ID) {
			try {
				const channel = await member.guild.channels.fetch(
					process.env.WELCOME_CHANNEL_ID
				);

				if (!channel || channel.type !== ChannelType.GuildText) return;

				const welcomeEmbed = new EmbedBuilder()
					.setColor("#ED4245")
					.setDescription(
						`Bonjour <@!${member.user.id}>, bienvenue au **Cercle Richelieu** !\n\nPour accéder au reste du serveur, vous devez passer l’entretien d’admission.\n🎙️ *L'entretien se passe uniquement en vocal.*\n\n🗓️ *Veuillez indiquer dans ce salon vos disponibilités pour cet entretien.*\n\nEn attendant, je vous encourage à consulter notre #𝐂𝐇𝐀𝐑𝐓𝐄\nVous pouvez aussi consulter notre site [ici](https://www.lecerclerichelieu.fr/).`
					);

				await Promise.all([channel.sendTyping(), timeout(3)]);
				await channel.send({ embeds: [welcomeEmbed] });

				console.log(
					`${member.user.tag} a rejoint : Message de bienvenue envoyé dans le salon ${channel.name}`
				);
			} catch (err) {
				console.log(
					"Une erreur est survenue lors du traitement de l'évènement Events.GuildMemberAdd :"
				);
				console.error(err);
			}
		}
	});
};
