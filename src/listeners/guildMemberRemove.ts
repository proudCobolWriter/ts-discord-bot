import { Events, type Client, ChannelType } from "discord.js";

import config from "../../config.js";

const enabled =
	config.welcomeMessageSettings.enable &&
	config.welcomeMessageSettings.messages.length > 0;

export default (client: Client): void => {
	client.on(Events.GuildMemberRemove, async (member): Promise<void> => {});
};
