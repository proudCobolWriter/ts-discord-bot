import type { Client, Guild, VoiceState, GuildMember } from "discord.js";

const WhitelistedVoiceChannels = (process.env.VOICE_CHANNELS_IDS as string)
	.replace(/ /g, "")
	.split(",");

const [MainRole, MainGuild] = [
	process.env.ROLE_ID,
	process.env.GUILD_ID,
] as Array<string>;

const setRole = (
	guild: Guild,
	member: GuildMember,
	shouldHaveRole: boolean
) => {
	const hasRole = member.roles.cache.some((role) => role.id === MainRole);
	if (shouldHaveRole === hasRole)
		// makes sure we don't needlessly add/remove the role from the user
		return Promise.resolve();

	const role = guild.roles.cache.get(MainRole);
	if (!role)
		return Promise.reject("Le rôle n'a pas été trouvé dans le serveur");

	return member.roles[shouldHaveRole ? "add" : "remove"](
		role,
		`Cet utilisateur a ${
			shouldHaveRole ? "rejoint" : "quitté"
		} un canal vocal whitelist`
	);
};

export default (client: Client) => {
	client.on(
		"voiceStateUpdate",
		(oldState: VoiceState, newState: VoiceState) => {
			if (oldState.guild.id !== MainGuild) return;

			const members = newState.guild.members;
			const member = members.cache.get(newState.id);

			if (!member) {
				console.error("Le membre n'a pas été trouvé dans le serveur");
				return;
			}

			const handlePromiseRejection = (promise: Promise<void>): void => {
				promise.catch((err) => {
					console.log(
						"Une erreur a été rencontrée lors de l'assignation du rôle :"
					);
					console.error(err);
				});
			};

			if (newState.channelId === null && oldState.channelId !== null) {
				handlePromiseRejection(
					setRole(newState.guild, member, false)?.then(() => {
						console.log(`Rôle de ${member.user.username} enlevé`);
					})
				);
			} else if (
				newState.channelId !== null &&
				oldState.channelId === null
			) {
				handlePromiseRejection(
					setRole(
						newState.guild,
						member,
						WhitelistedVoiceChannels.includes(newState.channelId)
					)?.then(() => {
						console.log(`Rôle de ${member.user.username} ajouté`);
					})
				);
			} else if (
				newState.channelId !== null &&
				oldState.channelId !== null
			) {
				handlePromiseRejection(
					setRole(
						newState.guild,
						member,
						WhitelistedVoiceChannels.includes(newState.channelId)
					)?.then(() => {
						console.log(
							`${member.user.username} a changé de salon vocal`
						);
					})
				);
			}
		}
	);
};
