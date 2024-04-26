import { ChannelType, type Client } from "discord.js";
import Parser, { type ParserOptions } from "rss-parser";
import type { PathLike } from "fs";

import type { Job, SimpleIntervalSchedule } from "./index.js";
import PersistentCacher from "../utils/persistentCacher.js";
import { URLs } from "../constants/urls.js";
import config from "../../config.js";
import { format } from "../utils/sharedFunctions.js";
import type { ExternalRule, YoutubeRule } from "../../configTypes.js";

export class Notifications implements Job {
	static createParser(
		opts?: ParserOptions<{ [key: string]: unknown }, { [key: string]: unknown }>,
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
		this.feedParser = Notifications.createParser({ timeout: 10e3 });
		this.cacher = Notifications.createCacher();
		this.client = client;
	}

	public async run(): Promise<void> {
		const runRSSParser = async (
			ruleType: "YouTube" | "External",
			entryName: string,
			rule: YoutubeRule | ExternalRule,
			feed: { [key: string]: string } & Parser.Output<{ [key: string]: string }>,
		) => {
			const latestItem = feed.items[0];
			const channel = this.client.channels.cache.get(rule.discordChannel);
			if (!channel || channel.type !== ChannelType.GuildText) return;

			const latestMessages = await channel.messages.fetch({ limit: 10 });

			if (latestMessages) {
				try {
					const cache = JSON.parse(this.cacher.get(entryName));
					if (
						cache.items[0].link === latestItem.link ||
						cache.items[0].title === latestItem.title
					)
						return;
				} catch (err) {
					/* the cache content is either invalid or empty */
				}

				const alreadySent = latestMessages.some(
					(msg) =>
						JSON.stringify(msg).includes(latestItem.link || "") ||
						JSON.stringify(msg).includes(latestItem.title || ""),
				);

				if (!alreadySent) {
					this.cacher.write(entryName, JSON.stringify(feed));

					await channel.send(
						JSON.parse(format(JSON.stringify(rule.message), latestItem)),
					);

					console.log(
						`Notification ${ruleType === "YouTube" ? ruleType : "RSS"} ${feed.title} envoyée`,
					);
				}
			}
		};

		for (const rule of config.notificationSettings.youtubeRules || []) {
			const feed = await this.feedParser.parseURL(
				URLs.FEED_YOUTUBE + rule.youtubeChannel,
			);
			console.log("Successfully retrieved the YouTube feed " + rule.youtubeChannel);

			if (!feed || feed.items.length === 0) continue;
			runRSSParser("YouTube", "ytb-" + rule.youtubeChannel, rule, feed);
		}

		for (const rule of config.notificationSettings.externalRules || []) {
			const feed = await this.feedParser.parseURL(rule.rssFeed);
			console.log("Successfully retrieved the YouTube rssFeed for " + rule.rssFeed);

			if (!feed || feed.items.length === 0) continue;
			runRSSParser("External", "rss-" + rule.name, rule, feed);
		}
	}
}
