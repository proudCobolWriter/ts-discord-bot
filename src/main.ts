import "dotenv/config.js";
import "./setuplogger.js";
import "./utils/validateEnv.js";

import data from "./utils/config.js";
console.log(data);

// Initialize the bot //

import { default as client } from "./setupbot.js";

console.log("Instance de bot créée avec succès !");

import { JobService } from "./services/index.js";
import { UpdateBotPresence, RolePurger } from "./jobs/index.js";

const jobService = new JobService([
	new UpdateBotPresence(client),
	new RolePurger(client),
]);

jobService.start();

// Handle process termination //

import { GracefulShutdown, RejectionsHandler } from "./process/index.js";

GracefulShutdown(client, jobService);
RejectionsHandler();
