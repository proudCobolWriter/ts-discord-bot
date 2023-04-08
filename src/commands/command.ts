import type {
	CommandInteraction,
	ChatInputApplicationCommandData,
	Client,
} from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
	run: (client: Client, interaction: CommandInteraction) => void;
}

// List of commands //

import { about } from "./about.js";

const Commands: Command[] = [about];

export default Commands;
