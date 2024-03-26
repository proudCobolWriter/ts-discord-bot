import type { SimpleIntervalSchedule } from "toad-scheduler";
import type { BaseMessageOptions, PresenceData, Snowflake } from "discord.js";

// Type definitions //

//   Generics //
type NumericRange<
	START extends number,
	END extends number,
	ARR extends unknown[] = [],
	ACC extends number = never,
> = ARR["length"] extends END
	? ACC | START | END
	: NumericRange<
			START,
			END,
			[...ARR, 1],
			ARR[START] extends undefined ? ACC : ACC | ARR["length"]
		>;

//	 Types	 //
export type DisableableSetting = {
	enable: boolean;
};

export type IntervalSchedule = Omit<SimpleIntervalSchedule, "runImmediately">;

export type WelcomeMessage = {
	readonly message: BaseMessageOptions;
	readonly guild: Snowflake;
	readonly channel: Snowflake;
	readonly typingDuration?: 3;
};

export type AutoroleRule = {
	readonly channels: Snowflake[];
	readonly roles: Snowflake[];
	readonly guild: Snowflake;
};

export type MessagePurgeRule = {
	readonly channel: Snowflake;
	readonly UTCtime: UTCtime;
	readonly guild: Snowflake;
};

export type UTCtime = {
	readonly hour: NumericRange<0, 24>;
	readonly minute?: NumericRange<0, 60>;
	readonly second?: NumericRange<0, 60>;
};

export type YoutubeRule = {
	readonly message: BaseMessageOptions;
	readonly youtubeChannel: string;
	readonly discordChannel: Snowflake;
};

export type ExternalRule = {
	readonly name: string;
	readonly message: BaseMessageOptions;
	readonly rssFeed: string;
	readonly discordChannel: Snowflake;
};

export type YoutubeNotificationSettings = {
	readonly youtubeRules?: Array<YoutubeRule>;
};

export type ExternalNotificationSettings = {
	readonly externalRules?: Array<ExternalRule>;
};

export interface PresenceDataExtra extends PresenceData {
	readonly retrieveGuildInfo?: {
		guild: Snowflake;
		entries: Array<"%member_count%" | "%channel_count%" | "%role_count%">;
	};
}

//  Interfaces  //
export interface ModerationLogsSettings extends DisableableSetting {
	readonly language?: string;
	readonly ban?: {
		readonly channels: Snowflake[];
		readonly guild: Snowflake;
		readonly includePardon?: boolean;
	};
	readonly timeout?: {
		readonly channels: Snowflake[];
		readonly guild: Snowflake;
		readonly includePardon?: boolean;
	};
	readonly kick?: {
		readonly channels: Snowflake[];
		readonly guild: Snowflake;
	};
}

export interface WelcomeMessageSettings extends DisableableSetting {
	messages: Array<WelcomeMessage>;
}

export interface VoiceAutoroleSettings extends DisableableSetting {
	rules: Array<AutoroleRule>;
	purgeInterval: IntervalSchedule;
}

export interface MessagePurgerSettings extends DisableableSetting {
	rules: Array<MessagePurgeRule>;
	checkInterval: IntervalSchedule;
}

export interface DailyMessageSettings extends DisableableSetting {
	messageList: BaseMessageOptions[];
	usersAffected: Snowflake[];
	checkInterval: IntervalSchedule;
	UTCtime: UTCtime;
}

export interface NotificationSettings
	extends DisableableSetting,
		YoutubeNotificationSettings,
		ExternalNotificationSettings {
	queryInterval: IntervalSchedule;
}

export interface PresenceSettings extends DisableableSetting {
	presences: Array<PresenceDataExtra>;
	cycleInterval: IntervalSchedule;
}

// Main export //
export interface ConfigData {
	moderationLogsSettings: Readonly<ModerationLogsSettings>;
	welcomeMessageSettings: Readonly<WelcomeMessageSettings>;
	voiceAutoroleSettings: Readonly<VoiceAutoroleSettings>;
	messagePurgerSettings: Readonly<MessagePurgerSettings>;
	dailyMessageSettings: Readonly<DailyMessageSettings>;
	notificationSettings: Readonly<NotificationSettings>;
	presenceSettings: Readonly<PresenceSettings>;
}
