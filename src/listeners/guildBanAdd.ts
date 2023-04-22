import { Events, type Client } from "discord.js";

import config from "../../config.js";

const enabled = true;

export default (client: Client): void => {
	client.on(Events.GuildBanAdd, (ban) => {
		if (!enabled || ban.user.bot) return;
	});
};
