import type { Client } from "discord.js";
import type { JobService } from "../services/index.js";

export default (client: Client, jobService: JobService): void => {
	const terminate = (signal: string) => {
		console.log(`Arrêt du bot : signal ${signal} reçu`);

		jobService.getScheduler().stop();

		console.log("Tâche(s) arrétée(s)");

		client.removeAllListeners();
		client.destroy();

		console.log("Connection WebSocket fermée");

		process.exit(0);
	};

	process.on("SIGINT", terminate);
	process.on("SIGTERM", terminate);

	/*
	Causes a uv_signal_start EINVA error on newer Node versions

	process.on("SIGKILL", () =>
		console.log("\nSignal SIGKILL détecté (kill via Powershell possible)\n")
	);

	*/
};
