import type { BaseMessageOptions } from "discord.js";

// Type definitions //

//    Enums    //
export enum LanguageCode {
	en = "en",
	fr = "fr",
}

//  Interfaces  //
export interface TranslatedData {
	extraText?: string;
	message: BaseMessageOptions;
}

export interface ModerationLogsLangData {
	ban: { [key in LanguageCode]: TranslatedData };
	unban: { [key in LanguageCode]: TranslatedData };
}

// Main export //
export interface MiscLangData {
	moderationLogs: Readonly<ModerationLogsLangData>;
}
