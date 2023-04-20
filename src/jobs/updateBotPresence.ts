import type { Job, SimpleIntervalSchedule } from "./index.js";
import type { PresenceDataExtra } from "../../configTypes.js";
import { ChannelType, type Client } from "discord.js";

import config from "../../config.js";

const enabled =
	config.presenceSettings.enable && config.presenceSettings.presences.length > 0;

export class UpdateBotPresence implements Job {
	public name = "Update Bot Presence";
	public settings: SimpleIntervalSchedule = {
		runImmediately: false,
		...config.presenceSettings.cycleInterval,
	};

	private client: Client;
	private presenceIndex = 0;

	constructor(client: Client) {
		this.client = client;
	}

	public async run(): Promise<void> {
		if (!enabled || !this.client.isReady() || !this.client.user) return;

		const currentPresenceInfo = JSON.parse(
			JSON.stringify(config.presenceSettings.presences[this.presenceIndex])
		) as PresenceDataExtra;

		const { activities, retrieveGuildInfo } = currentPresenceInfo;
		if (!activities) return;

		if (retrieveGuildInfo) {
			const guild = this.client.guilds.cache.get(retrieveGuildInfo.guild);

			if (guild) {
				const [channels, roles] = await Promise.all([
					guild.channels.fetch(),
					guild.roles.fetch(),
				]);

				activities.forEach((activity) => {
					for (const entry of retrieveGuildInfo.entries) {
						switch (entry) {
							case "%member_count%":
								activity.name = activity.name?.replaceAll(
									entry,
									guild.memberCount.toLocaleString()
								);
								break;
							case "%channel_count%":
								activity.name = activity.name?.replaceAll(
									entry,
									channels
										.filter(
											(channel) =>
												channel?.type !==
												ChannelType.GuildCategory
										)
										.size.toString()
								);
								break;
							case "%role_count%":
								activity.name = activity.name?.replaceAll(
									entry,
									(roles.size - 1).toString()
								);
						}
					}
				});
			} else
				console.error(
					`{TÂCHE ${this.name}} Un serveur a été spécifié dans la configuration du bot mais est introuvable`
				);
		}

		this.client.user.setPresence({
			retrieveGuildInfo: undefined,
			...currentPresenceInfo,
		});

		this.presenceIndex =
			(this.presenceIndex + 1) % config.presenceSettings.presences.length;
	}
}
