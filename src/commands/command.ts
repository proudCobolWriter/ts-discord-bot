import type {
	CommandInteraction,
	ChatInputApplicationCommandData,
	Client,
	AutocompleteInteraction,
} from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
	run: (client: Client, interaction: CommandInteraction) => void;
	autocomplete?: (client: Client, interaction: AutocompleteInteraction) => void;
}

// List of commands //

import { about } from "./about.js";
import { ping } from "./ping.js";
import { say } from "./say.js";

const Commands: Command[] = [about, ping, say];

export default Commands;
