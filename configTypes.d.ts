import type { SimpleIntervalSchedule } from "toad-scheduler";
import type { BaseMessageOptions, PresenceData, Snowflake } from "discord.js";

// Type definitions //

//   Generics //
type NumericRange<
	START extends number,
	END extends number,
	ARR extends unknown[] = [],
	ACC extends number = never
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

export type UTCtime = {
	hour: NumericRange<0, 24>;
	minute?: NumericRange<0, 60>;
	second?: NumericRange<0, 60>;
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

export interface DailyMessageSettings extends DisableableSetting {
	messageList: BaseMessageOptions[];
	usersAffected: Snowflake[];
	checkInterval: IntervalSchedule;
	UTCtime: UTCtime;
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
	welcomeMessageSettings: WelcomeMessageSettings;
	voiceAutoroleSettings: VoiceAutoroleSettings;
	dailyMessageSettings: DailyMessageSettings;
	notificationSettings: NotificationSettings;
	presenceSettings: PresenceSettings;
}
