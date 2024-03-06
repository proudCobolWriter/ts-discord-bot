import {
	type CommandInteraction,
	type Client,
	type Interaction,
	InteractionType,
	type AutocompleteInteraction,
	Events,
} from "discord.js";
import type { RateLimiter } from "discord.js-rate-limiter";

import Commands from "../commands/command.js";

const handleInteraction = async (
	client: Client,
	interaction: CommandInteraction,
	rateLimiter: RateLimiter,
): Promise<void> => {
	const slashCommand = Commands.find((c) => c.name === interaction.commandName);

	if (!slashCommand) {
		await interaction.deferReply({ ephemeral: true });

		interaction
			.followUp({
				content: "```diff\n- Une erreur s'est produite```",
			})
			.then((followUp) => {
				setTimeout(() => {
					interaction.deleteReply(followUp.id).catch(console.error);
				}, 4e3);
			})
			.catch(console.error);
		return;
	}

	if (rateLimiter.take(interaction.user.id)) {
		await interaction.deferReply({ ephemeral: true });

		interaction
			.followUp({
				content: "```diff\n- Veuillez attendre le cooldown!```",
			})
			.then((followUp) => {
				setTimeout(() => {
					interaction.deleteReply(followUp.id).catch();
				}, 1.5e3);
			})
			.catch(console.error);

		return;
	}

	slashCommand.run(client, interaction);
};

const handleAutocompletion = async (
	client: Client,
	interaction: AutocompleteInteraction,
) => {
	const slashCommand = Commands.find((c) => c.name === interaction.commandName);

	if (slashCommand && slashCommand.autocomplete != undefined) {
		slashCommand.autocomplete(client, interaction);
	}
};

export default (client: Client, rateLimiter: RateLimiter): void => {
	client.on(Events.InteractionCreate, (interaction: Interaction): void => {
		if (interaction.isCommand() || interaction.isContextMenuCommand()) {
			handleInteraction(client, interaction, rateLimiter).catch((err) => {
				console.log(
					"Une erreur est survenue lors du traitement d'une interaction :",
				);
				console.error(err);
			});
		} else if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
			handleAutocompletion(client, interaction).catch((err) => {
				console.log(
					"Une erreur est survenue lors du traitement d'une autocomplétion :",
				);
				console.error(err);
			});
		}
	});
};
