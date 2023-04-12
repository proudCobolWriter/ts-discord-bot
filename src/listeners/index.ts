import path from "path";
import filesystem from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default filesystem
	.readdirSync(__dirname)
	.filter((file) => !file.startsWith("index") && !file.startsWith("ready"));
