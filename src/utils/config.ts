import fs from "fs/promises";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

import { fillMissing } from "object-fill-missing-keys";

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const PATH_TO_CONFIG = path.resolve(CURRENT_DIR, "..", "..", "config.json");

const DEFAULT_DATA = {
	welcomeMessageSettings: {
		enable: false,
		messages: [],
	},
	voiceAutoroleSettings: {
		enable: false,
		rules: [],
	},
};

let jsonData = {};

try {
	const file = await fs.readFile(PATH_TO_CONFIG, { encoding: "utf-8" });
	jsonData = JSON.parse(file);
} catch (err) {
	console.log("Impossible de lire le fichier config.json :");
	console.error(err);
}

jsonData = fillMissing(jsonData, DEFAULT_DATA);

export default jsonData;
