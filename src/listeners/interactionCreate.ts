import type { CommandInteraction, Client, Interaction } from "discord.js";
import type { RateLimiter } from "discord.js-rate-limiter";
import Commands from "../commands/command.js";

const handleSlashCommand = async (
	client: Client,
	interaction: CommandInteraction,
	rateLimiter: RateLimiter
): Promise<void> => {
	await interaction.deferReply({ ephemeral: true });

	const slashCommand = Commands.find(
		(c) => c.name === interaction.commandName
	);
	if (!slashCommand) {
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

export default (client: Client, rateLimiter: RateLimiter): void => {
	client.on("interactionCreate", async (interaction: Interaction) => {
		if (interaction.isCommand() || interaction.isContextMenuCommand()) {
			try {
				await handleSlashCommand(client, interaction, rateLimiter);
			} catch (err) {
				console.log(
					"Une erreur est survenue lors du traitement d'une interaction :"
				);
				console.error(err);
			}
		}
	});
};
