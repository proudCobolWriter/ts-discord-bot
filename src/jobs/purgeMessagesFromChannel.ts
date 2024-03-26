import { type Job, type SimpleIntervalSchedule } from "./index.js";
import type { Client } from "discord.js";
import type { PathLike } from "fs";
import PersistentCacher from "../utils/persistentCacher.js";

import config from "../../config.js";
import type { IntervalSchedule } from "../../configTypes.js";

const isLeapYear = (date: Date) => {
	const year = date.getFullYear();

	if ((year & 3) != 0) return false;

	return year % 100 != 0 || year % 400 == 0;
};

const getDayOfYear = (date: Date) => {
	const dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
	const mn = date.getMonth();
	const dn = date.getDate();
	let dayOfYear = dayCount[mn] + dn;

	if (mn > 1 && isLeapYear(date)) dayOfYear++;

	return dayOfYear;
};

const intervalToSeconds = (interval: IntervalSchedule) =>
	(interval.milliseconds || 0) / 1000 +
	(interval.seconds || 0) +
	(interval.minutes || 0) * 60 +
	(interval.hours || 0) * 60 * 60 +
	(interval.days || 0) * 60 * 60 * 24;

export class MessagePurger implements Job {
	static createCacher(cacheDir?: PathLike) {
		return new PersistentCacher(cacheDir);
	}

	public name = "Message Purger";
	public settings: SimpleIntervalSchedule = {
		runImmediately: false,
		...config.messagePurgerSettings.checkInterval,
	};
	public enabled =
		config.messagePurgerSettings.enable &&
		config.messagePurgerSettings.rules.length > 0;

	private lastTimeMessagesPurged: number | undefined;

	private cacher: PersistentCacher;

	private updateCache(channelId: string) {
		const cache = this.cacher.get("messagePurge-" + channelId);
		this.lastTimeMessagesPurged = parseInt(cache) || undefined;

		if (
			typeof this.lastTimeMessagesPurged === "number" &&
			isNaN(this.lastTimeMessagesPurged)
		)
			this.lastTimeMessagesPurged = undefined;
	}

	constructor(private client: Client) {
		this.cacher = MessagePurger.createCacher();
	}

	public async run(): Promise<void> {
		if (!this.client.isReady() || !this.client.user) return;

		for (const rule of config.messagePurgerSettings.rules) {
			const guild = this.client.guilds.cache.get(rule.guild);
			if (!guild) continue;

			this.updateCache(rule.channel);

			const now = new Date();

			const nowUTC = new Date(
				now.getUTCFullYear(),
				now.getUTCMonth(),
				now.getUTCDate(),
				now.getUTCHours(),
				now.getUTCMinutes(),
				now.getUTCSeconds(),
			);

			const afterUTC = new Date(
				now.getUTCFullYear(),
				now.getUTCMonth(),
				now.getUTCDate(),
				rule.UTCtime.hour,
				rule.UTCtime.minute,
				rule.UTCtime.second,
			);

			const dayOfYearNow = getDayOfYear(nowUTC);

			const timeDiff = (nowUTC.getTime() - afterUTC.getTime()) / 1000;

			if (
				this.lastTimeMessagesPurged !== dayOfYearNow &&
				nowUTC.getTime() >= afterUTC.getTime() &&
				timeDiff <
					intervalToSeconds(config.messagePurgerSettings.checkInterval) * 2
			) {
				this.lastTimeMessagesPurged = dayOfYearNow;
				this.cacher.write(
					"messagePurge-" + rule.channel,
					dayOfYearNow.toString(),
				);

				const channel = guild.channels.cache.get(rule.channel);
				if (!channel || !channel.isTextBased()) continue;

				let deleted;
				do {
					const fetched = await channel.messages.fetch({ limit: 100 });
					deleted = await channel.bulkDelete(fetched, true);
				} while (deleted.size != 0);
			}
		}
	}
}
