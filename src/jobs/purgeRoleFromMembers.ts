import type { Job, SimpleIntervalSchedule } from "./index.js";
import type { Client } from "discord.js";

import config from "../../config.js";

export class RolePurger implements Job {
	public name = "Role Purger";
	public settings: SimpleIntervalSchedule = {
		runImmediately: false,
		...config.voiceAutoroleSettings.purgeInterval,
	};
	public enabled =
		config.voiceAutoroleSettings.enable &&
		config.voiceAutoroleSettings.rules.length > 0;

	private client: Client;

	constructor(client: Client) {
		this.client = client;
	}

	public async run(): Promise<void> {
		if (!this.client.isReady() || !this.client.user) return;

		for (const rule of config.voiceAutoroleSettings.rules) {
			const guild = this.client.guilds.cache.get(rule.guild);
			if (!guild) continue;

			const members = await guild.members.fetch();
			const membersWithRole = members.filter(
				(member) =>
					member.voice.channelId !== rule.channel &&
					member.roles.cache.some((role) => role.id === rule.role)
			);

			await Promise.all(
				membersWithRole.map(async (member) => {
					await member.roles.remove(
						rule.role,
						"Cet utilisateur n'est pas censé avoir ce rôle"
					);
				})
			);

			if (membersWithRole.size > 0)
				console.log(
					`Purge effectuée pour le rôle <@&${rule.role}> sur le serveur ${guild.name} (${membersWithRole.size} rôle(s) retiré(s))`
				);
		}
	}
}
