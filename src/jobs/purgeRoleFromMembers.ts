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
					!rule.channels.includes(member.voice.channelId || "") &&
					member.roles.cache.some((role) => rule.roles.includes(role.id))
			);

			await Promise.all(
				membersWithRole.map(async (member) => {
					for (const role of rule.roles) {
						await member.roles.remove(
							role,
							"Cet utilisateur n'est pas censé avoir ce rôle"
						);
					}
				})
			);

			if (membersWithRole.size > 0)
				console.log(
					`Purge effectuée pour ${rule.roles.length} rôle(s) sur le serveur ${guild.name} (${membersWithRole.size} membres(s) affecté(s))`
				);
		}
	}
}
