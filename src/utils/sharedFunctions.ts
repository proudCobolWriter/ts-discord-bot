import type { HexColorString } from "discord.js";

export const format = (str: string, table: { [key: string]: string }): string => {
	const re = new RegExp(
		Object.keys(table)
			.map((value) => "%" + value + "%")
			.join("|"),
		"gi"
	);
	return str.replace(
		re,
		(matched: string) => table[matched.substring(1, matched.length - 1)]
	);
};

export const randomHexColor = (): HexColorString => {
	return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

export const randomHexColorRawNumber = (): number => {
	return Math.floor(Math.random() * 16777215);
};
