import "dotenv/config.js";
import "./utils/validateEnv.js";

// Initialize the bot //

import { default as client } from "./setupbot.js";
import "./setuplogger.js";

console.log("Instance de bot créée avec succès !");

// Handle process termination //

import { GracefulShutdown, RejectionsHandler } from "./process/index.js";

GracefulShutdown(client);
RejectionsHandler();
