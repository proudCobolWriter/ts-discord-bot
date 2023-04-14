import type { SimpleIntervalSchedule } from "toad-scheduler";
import type { APIEmbed, PresenceData, Snowflake } from "discord.js";

// Type definitions //

export type Setting = object;
export type DisableableSetting = {
	enable: boolean;
};

export type IntervalSchedule = Omit<SimpleIntervalSchedule, "runImmediately">;

export type WelcomeMessage = {
	embeds: Array<APIEmbed>;
	guild: Snowflake;
	channel: Snowflake;
	typingDuration?: 3;
};

export type AutoroleRule = {
	channel: Snowflake;
	role: Snowflake;
	guild: Snowflake;
};

export interface PresenceDataExtra extends PresenceData {
	retrieveGuildInfo?: {
		guild: Snowflake;
		entries: Array<"%member_count%" | "%channel_count%" | "%role_count%">;
	};
}

export interface WelcomeMessageSettings extends Setting, DisableableSetting {
	messages: Array<WelcomeMessage>;
}

export interface VoiceAutoroleSettings extends Setting, DisableableSetting {
	rules: Array<AutoroleRule>;
	purgeInterval: IntervalSchedule;
}

export interface PresenceSettings extends Setting, DisableableSetting {
	presences: Array<PresenceDataExtra>;
	cycleInterval: IntervalSchedule;
}

export interface ConfigData {
	welcomeMessageSettings: WelcomeMessageSettings;
	voiceAutoroleSettings: VoiceAutoroleSettings;
	presenceSettings: PresenceSettings;
}
