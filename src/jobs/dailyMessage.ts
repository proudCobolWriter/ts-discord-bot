import type { Client } from "discord.js";

import type { Job, SimpleIntervalSchedule } from "./index.js";
import type { PathLike } from "fs";
import PersistentCacher from "../utils/persistentCacher.js";
import config from "../../config.js";

const CACHE_ENTRY = "dailyMessage-lastDOYMessageSent";

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

export class DailyMessage implements Job {
	static createCacher(cacheDir?: PathLike) {
		return new PersistentCacher(cacheDir);
	}

	public name = "Notification Monitor";
	public settings: SimpleIntervalSchedule = {
		runImmediately: false,
		...config.dailyMessageSettings.checkInterval,
	};
	public enabled = config.dailyMessageSettings.enable;

	private lastDOYMessageSent: number | undefined;

	private cacher: PersistentCacher;

	private updateCache() {
		const cache = this.cacher.get(CACHE_ENTRY);
		this.lastDOYMessageSent = parseInt(cache) || undefined;

		if (typeof this.lastDOYMessageSent === "number" && isNaN(this.lastDOYMessageSent))
			this.lastDOYMessageSent = undefined;
	}

	constructor(private client: Client) {
		this.cacher = DailyMessage.createCacher();
	}

	public async run(): Promise<void> {
		this.updateCache();

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
			config.dailyMessageSettings.UTCtime.hour,
			config.dailyMessageSettings.UTCtime.minute,
			config.dailyMessageSettings.UTCtime.second,
		);

		const dayOfYearNow = getDayOfYear(nowUTC);

		if (
			this.lastDOYMessageSent !== dayOfYearNow &&
			nowUTC.getTime() >= afterUTC.getTime()
		) {
			this.lastDOYMessageSent = dayOfYearNow;
			this.cacher.write(CACHE_ENTRY, dayOfYearNow.toString());

			const messages = config.dailyMessageSettings.messageList;

			for (const user of config.dailyMessageSettings.usersAffected) {
				const discordUser = await this.client.users.fetch(user, { cache: true });
				if (discordUser.bot) continue;

				await discordUser.send(
					messages[Math.floor(Math.random() * messages.length)],
				);

				console.log(`Message envoyé avec succès à ${discordUser.tag}`);
			}
		}
	}
}
