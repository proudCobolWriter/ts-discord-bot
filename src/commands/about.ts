import {
	type CommandInteraction,
	type Client,
	/*type AutocompleteInteraction,*/
	ApplicationCommandType,
	ApplicationCommandOptionType,
} from "discord.js";
import type { Command } from "./command.js";

import lang from "../../lang/commands.json";

/*import { DiscordLimits } from "../constants/index.js";
import wiki, { type Link } from "wikijs";
import languagesList from "../utils/wikipediaLanguages.js";

interface WikiPage {
	links: Array<Link>;
	content: Array<object>;
	summary: string;
}

const aboutPageInfo = {} as WikiPage;
const languageChoices: string[] = [];

const page = await wiki().page("Bertrand du Guesclin");
const [content, summary, links] = await Promise.all([
	page.content(),
	page.summary(),
	page.langlinks(),
]);

aboutPageInfo.links = links;
aboutPageInfo.summary = summary;

links.forEach((elem) => {
	const language = languagesList.get(elem.lang);

	if (language) {
		languageChoices.push(
			`${language.lang} (${language.lang_loc})`.substring(
				0,
				DiscordLimits.MAXIMUM_AUTOCOMPLETION_CHOICE_LENGTH
			)
		);
	}
});

content.forEach((elem: any) => {
	//console.log(elem);
});*/

export const about: Command = {
	name: "duguesclin",
	description: "Returns the Wikipedia page of the famed Bertrand du Guesclin",
	type: ApplicationCommandType.ChatInput,
	dmPermission: true,
	options: [
		{
			name: "language",
			type: ApplicationCommandOptionType.String,
			description: "Your language of preference",
			required: false,
			autocomplete: true,
		},
		{
			name: "article",
			type: ApplicationCommandOptionType.String,
			description: "The part of the Wikipedia article to show",
			required: false,
			choices: [
				{
					name: "summary",
					value: "content",
				},
			],
		},
	],
	run: async (client: Client, interaction: CommandInteraction) => {
		await interaction.deferReply({ ephemeral: true });

		const error = () =>
			interaction.followUp({
				content: "```diff\n- Une erreur s'est produite```",
			});

		error();
	},
	autocomplete: async (/*client: Client, interaction: AutocompleteInteraction*/) => {
		/*const focusedValue = interaction.options.getFocused();
		const filtered = languageChoices.filter((choice) =>
			choice.startsWith(focusedValue)
		);

		filtered.length = Math.min(
			filtered.length,
			DiscordLimits.MAXIMUM_AUTOCOMPLETION_CHOICES
		);

		await interaction.respond(
			filtered.map((choice) => ({ name: choice, value: choice }))
		);*/
	},
};
