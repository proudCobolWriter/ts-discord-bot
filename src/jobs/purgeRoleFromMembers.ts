import type { Job, SimpleIntervalSchedule } from "./index.js";
import type { Client, Guild } from "discord.js";

const WhitelistedVoiceChannels = (process.env.VOICE_CHANNELS_IDS as string)
	.replace(/ /g, "")
	.split(",");

const [MainRole, MainGuild] = [process.env.ROLE_ID, process.env.GUILD_ID] as string[];

export class RolePurger implements Job {
	public name = "Role Purger";
	public settings: SimpleIntervalSchedule = {
		seconds: 5,
		runImmediately: false,
	};

	private client: Client;
	private guild: Guild | undefined;

	constructor(client: Client) {
		this.client = client;
		if (MainGuild) this.guild = client.guilds.cache.get(MainGuild);
	}

	public async run() {
		if (!this.guild) {
			console.error(`{TÂCHE ${this.name}} Le serveur n'a pas été trouvé`);
			return;
		}

		if (!this.client.isReady()) return;

		const members = await this.guild.members.fetch();
		const membersWithRole = members.filter((member) =>
			member.voice.channelId !== null &&
			WhitelistedVoiceChannels.includes(member.voice.channelId)
				? false
				: member.roles.cache.some((role) => role.id === MainRole)
		);

		await Promise.all(
			membersWithRole.map(async (member) => {
				await member.roles.remove(
					MainRole,
					"Cet utilisateur n'est pas censé avoir ce rôle"
				);
			})
		);

		if (membersWithRole.size > 0)
			console.log(`${membersWithRole.size} rôle(s) retiré(s) en masse`);
	}
}
