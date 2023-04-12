import type { Job, SimpleIntervalSchedule } from "./index.js";
import {
	ActivityType,
	PresenceUpdateStatus,
	type Client,
	type Guild,
} from "discord.js";

const MainGuild = process.env.GUILD_ID as string;

export class UpdateBotPresence implements Job {
	public name = "Update Bot Presence";
	public settings: SimpleIntervalSchedule = {
		seconds: 5,
		runImmediately: false,
	};

	private client: Client;
	private guild: Guild | undefined;

	constructor(client: Client) {
		this.client = client;
		if (process.env.GUILD_ID)
			this.guild = client.guilds.cache.get(MainGuild);
	}

	public async run() {
		if (!this.guild) {
			console.error(`{TÂCHE ${this.name}} Le serveur n'a pas été trouvé`);
			return;
		}

		if (!this.client.isReady()) return;

		const type = ActivityType.Watching;
		const name = `${this.guild.memberCount.toLocaleString()} members`;

		this.client.user?.setPresence({
			activities: [
				{
					name,
					type,
				},
			],
			status: PresenceUpdateStatus.Online,
		});
	}
}
