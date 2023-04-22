// Type definitions //

//    Enums    //
import type { LanguageCode } from "./misc.d.js";

export enum CommandName {
	about = "about",
	ping = "ping",
}

//    Types    //
export type LocalizationObject = { [key in LanguageCode]: string };

//  Interfaces  //
export interface Lang {
	nameLocalizations: LocalizationObject;
	descriptionLocalizations: LocalizationObject;
}

export interface CommandLang extends Lang {
	options: { [key: string]: Lang };
}

//  Main export  //
export type CommandLangData = { [key in CommandName]: CommandLang };
