import { ChannelType, type Client } from "discord.js";
import Parser, { type ParserOptions } from "rss-parser";
import type { PathLike } from "fs";

import type { Job, SimpleIntervalSchedule } from "./index.js";
import PersistentCacher from "../utils/persistentCacher.js";
import { URLs } from "../constants/urls.js";
import config from "../../config.js";
import { format } from "../utils/sharedFunctions.js";

export class Notifications implements Job {
	static createParser(
		opts?: ParserOptions<{ [key: string]: unknown }, { [key: string]: unknown }>
	) {
		return new Parser(opts);
	}

	static createCacher(cacheDir?: PathLike) {
		return new PersistentCacher(cacheDir);
	}

	public name = "Notification Monitor";
	public settings: SimpleIntervalSchedule = {
		runImmediately: false,
		...config.notificationSettings.queryInterval,
	};
	public enabled = config.notificationSettings.enable;

	private feedParser: Parser;
	private cacher: PersistentCacher;
	private client: Client;

	constructor(client: Client) {
		this.feedParser = Notifications.createParser();
		this.cacher = Notifications.createCacher();
		this.client = client;
	}

	public async run(): Promise<void> {
		for (const { message, youtubeChannel, discordChannel } of config
			.notificationSettings.youtubeRules || []) {
			const feed = await this.feedParser.parseURL(
				URLs.FEED_YOUTUBE + youtubeChannel
			);

			if (!feed || feed.items.length === 0) continue;

			const latestVideo = feed.items[0];
			const channel = this.client.channels.cache.get(discordChannel);
			if (!channel || channel.type !== ChannelType.GuildText) continue;

			const latestMessages = await channel.messages.fetch({ limit: 10 });

			if (latestMessages) {
				const entryName = "ytb-" + youtubeChannel;

				try {
					const cache = JSON.parse(this.cacher.get(entryName));
					if (cache.items[0].link === latestVideo.link) continue;
				} catch (err) {
					/* the cache content is either invalid or empty */
				}

				const alreadySent = latestMessages.some((msg) =>
					JSON.stringify(msg).includes(latestVideo.link || "")
				);

				if (!alreadySent) {
					await channel.send(
						JSON.parse(format(JSON.stringify(message), latestVideo))
					);

					console.log(`Notification YouTube ${feed.title} envoyée`);

					try {
						this.cacher.write(entryName, JSON.stringify(feed));
					} catch (err) {
						console.error(err);
					}
				}
			}
		}
	}
}
