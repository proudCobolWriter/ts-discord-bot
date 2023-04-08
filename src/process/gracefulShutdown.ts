import type { Client } from "discord.js";

export default (client: Client): void => {
	const terminate = (signal: string) => {
		console.log(`Arrêt du bot : signal ${signal} reçu`);

		client.removeAllListeners();
		client.destroy();

		console.log("Connection WebSocket fermée");

		process.exit(0);
	};

	process.on("SIGINT", terminate);
	process.on("SIGTERM", terminate);
	process.on("SIGKILL", () =>
		console.log("\nSignal SIGKILL détecté (kill via Powershell possible)\n")
	);
};