import {
	type CommandInteraction,
	type Client,
	/*type AutocompleteInteraction,*/
	ApplicationCommandType,
	ApplicationCommandOptionType,
} from "discord.js";

import type { Command } from "./command.js";
import lang from "../../lang/commands.json" assert { type: "json" };

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
	nameLocalizations: lang.about.nameLocalizations,
	description: "Returns the Wikipedia page of the famed Bertrand du Guesclin",
	descriptionLocalizations: lang.about.descriptionLocalizations,
	type: ApplicationCommandType.ChatInput,
	dmPermission: true,
	options: [
		{
			name: "language",
			nameLocalizations: lang.about.options.language.nameLocalizations,
			description: "Your language of choice",
			descriptionLocalizations:
				lang.about.options.language.descriptionLocalizations,
			type: ApplicationCommandOptionType.String,
			required: false,
			autocomplete: true,
		},
		{
			name: "article",
			nameLocalizations: lang.about.options.article.nameLocalizations,
			description: "The part of the Wikipedia article to show",
			type: ApplicationCommandOptionType.String,
			descriptionLocalizations: lang.about.options.article.descriptionLocalizations,
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
