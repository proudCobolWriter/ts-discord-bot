import {
	type Client,
	type Guild,
	type VoiceState,
	type GuildMember,
	type Snowflake,
	Events,
} from "discord.js";

import config from "../../config.js";

const enabled =
	config.voiceAutoroleSettings.enable && config.voiceAutoroleSettings.rules.length > 0;

const setRole = async (
	guild: Guild,
	member: GuildMember,
	shouldHaveRole: boolean,
	roleId: Snowflake
) => {
	const hasRole = member.roles.cache.some((role) => role.id === roleId);
	if (shouldHaveRole === hasRole)
		// makes sure we don't needlessly add/remove the role from the user
		return Promise.resolve();

	const role = guild.roles.cache.get(roleId);
	if (!role) return Promise.reject("Le rôle n'a pas été trouvé dans le serveur");

	await member.roles[shouldHaveRole ? "add" : "remove"](
		role,
		`Cet utilisateur a ${
			shouldHaveRole ? "rejoint" : "quitté"
		} un canal vocal whitelist`
	);

	console.log(
		`Rôle de ${member.user.username} ${shouldHaveRole ? "ajouté" : "retiré"}`
	);
};

export default (client: Client): void => {
	client.on(
		Events.VoiceStateUpdate,
		(oldState: VoiceState, newState: VoiceState): void => {
			if (!enabled) return;

			const member = newState.guild.members.cache.get(newState.id);
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

			for (const { channel, role } of config.voiceAutoroleSettings.rules) {
				if (newState.channelId === null && oldState.channelId !== null) {
					// Member left a voice channel
					handlePromiseRejection(setRole(newState.guild, member, false, role));
				} else if (newState.channelId !== null && oldState.channelId === null) {
					// Member joined a voice channel
					handlePromiseRejection(
						setRole(
							newState.guild,
							member,
							newState.channelId === channel,
							role
						)
					);
				} else if (newState.channelId !== null && oldState.channelId !== null) {
					// Member switched voice channels
					handlePromiseRejection(
						setRole(
							newState.guild,
							member,
							newState.channelId === channel,
							role
						)
					);
				}
			}
		}
	);
};
