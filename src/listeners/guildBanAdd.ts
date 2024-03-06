import {
	Events,
	type Client,
	type BaseMessageOptions,
	ChannelType,
	AuditLogEvent,
} from "discord.js";

import type { MiscLangData, LanguageCode } from "../../lang/misc.d.ts";
import { format, randomHexColorRawNumber } from "../utils/sharedFunctions.js";
import config from "../../config.js";
import lang from "../../lang/misc.json" assert { type: "json" };

const langData: MiscLangData = lang;
const settings = config.moderationLogsSettings;

export default (client: Client): void => {
	client.on(Events.GuildBanAdd, async (ban): Promise<void> => {
		if (!settings.enable || !settings.ban || ban.user.bot) return;

		const { guild, channels } = settings.ban;
		if (guild !== ban.guild.id) return;

		if (!guild) {
			console.error(
				"Un serveur Discord doit être spécifié pour envoyer des notifications de bannissement",
			);
			return;
		}

		if (!channels) {
			console.error(
				"Un/des salon(s) Discord doit/doivent être spécifié(s) pour envoyer des notifications de bannissement",
			);
			return;
		}

		const discordGuild = client.guilds.cache.get(guild);
		if (!discordGuild) return;

		try {
			for (const channelID of channels) {
				const channel = await discordGuild.channels.fetch(channelID);
				if (!channel || channel.type !== ChannelType.GuildText) return;

				const auditLogs = await discordGuild.fetchAuditLogs({
					type: AuditLogEvent.MemberBanAdd,
				});
				if (!auditLogs || auditLogs.entries.size === 0) return;

				const firstLog = auditLogs.entries.first();
				if (!firstLog || !firstLog.executor) return;

				const messageLangData =
					langData.moderationLogs.ban[settings.language as LanguageCode] ||
					langData.moderationLogs.ban["en"];

				const rawMessage = messageLangData.message;
				const formattedMessage = <BaseMessageOptions>JSON.parse(
					format(JSON.stringify(rawMessage), {
						ban_count: auditLogs.entries.size.toString(),
						iso_string: new Date().toISOString(),
						user_id: ban.user.id,
						user_tag: ban.user.tag,
						user_mention: "<@!" + ban.user.id + ">",
						ban_reason: firstLog.reason || `(${messageLangData.extraText})`,
						mod_id: firstLog.executor.id,
						mod_tag: firstLog.executor.tag,
						mod_mention: "<@!" + firstLog.executor.id + ">",
					}).replaceAll("-101", randomHexColorRawNumber().toString()),
				);

				await channel.send(formattedMessage);

				console.log(
					`Notification de bannissement envoyée dans le salon ${channel.name}`,
				);
			}
		} catch (err) {
			console.log(`Une erreur est survenue lors de l'envoi du message de ban :`);
			console.error(err);
		}
	});
};
