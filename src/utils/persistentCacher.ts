import fs, { existsSync, writeFileSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const defaultCachePath = resolve(__dirname, "..", "..", "cache");

export default class PersistentCacher {
	private ensureCacheDir(): boolean | void {
		if (!existsSync(this.cacheDir)) {
			try {
				fs.mkdirSync(this.cacheDir);
			} catch (err) {
				console.error(err);
				return false;
			}
		}
	}

	constructor(private readonly cacheDir: fs.PathLike = defaultCachePath) {}

	public get(entry: string): string {
		if (!entry) {
			console.error("Une entrée doit être spécifiée");
			return "";
		}

		if (this.ensureCacheDir() === false) {
			console.error("Le répertoire cache n'a pas pu être créé");
			return "";
		}

		const path = join(this.cacheDir.toString(), entry + ".cache");

		if (existsSync(path) && fs.lstatSync(path).isFile()) {
			try {
				return fs.readFileSync(path, { encoding: "utf-8" });
			} catch (err) {
				console.error(err);
			}
		}
		return "";
	}

	public write(entry: string, data = ""): void {
		if (!entry) {
			console.error("Une entrée doit être spécifiée");
			return;
		}

		if (this.ensureCacheDir() === false) {
			console.error("Le répertoire cache n'a pas pu être créé");
			return;
		}

		const path = join(this.cacheDir.toString(), entry + ".cache");

		if (existsSync(path) && fs.lstatSync(path).isDirectory()) {
			console.error("L'entrée ne doit pas pointer à un dossier");
			return;
		}

		try {
			const bufData = Buffer.alloc(Buffer.byteLength(data), data, "utf-8");
			writeFileSync(path, bufData);
		} catch (err) {
			console.error(err);
		}
	}
}
