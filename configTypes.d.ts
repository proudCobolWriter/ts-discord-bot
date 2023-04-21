import type { SimpleIntervalSchedule } from "toad-scheduler";
import type { BaseMessageOptions, PresenceData, Snowflake } from "discord.js";

// Type definitions //

//	 Types	 //
export type Setting = object;
export type DisableableSetting = {
	enable: boolean;
};

export type IntervalSchedule = Omit<SimpleIntervalSchedule, "runImmediately">;

export type WelcomeMessage = {
	message: BaseMessageOptions;
	guild: Snowflake;
	channel: Snowflake;
	typingDuration?: 3;
};

export type AutoroleRule = {
	channel: Snowflake;
	role: Snowflake;
	guild: Snowflake;
};

export type YoutubeRule = {
	message: BaseMessageOptions;
	youtubeChannel: string;
	discordChannel: Snowflake;
};

export type YoutubeNotificationSettings = {
	youtubeRules?: Array<YoutubeRule>;
};

export interface PresenceDataExtra extends PresenceData {
	retrieveGuildInfo?: {
		guild: Snowflake;
		entries: Array<"%member_count%" | "%channel_count%" | "%role_count%">;
	};
}

//  Interfaces  //
export interface WelcomeMessageSettings extends DisableableSetting {
	messages: Array<WelcomeMessage>;
}

export interface VoiceAutoroleSettings extends DisableableSetting {
	rules: Array<AutoroleRule>;
	purgeInterval: IntervalSchedule;
}

export interface NotificationSettings
	extends DisableableSetting,
		YoutubeNotificationSettings {
	queryInterval: IntervalSchedule;
}

export interface PresenceSettings extends DisableableSetting {
	presences: Array<PresenceDataExtra>;
	cycleInterval: IntervalSchedule;
}

export interface ConfigData {
	welcomeMessageSettings: Setting & WelcomeMessageSettings;
	voiceAutoroleSettings: Setting & VoiceAutoroleSettings;
	notificationsSettings: Setting & NotificationSettings;
	presenceSettings: Setting & PresenceSettings;
}