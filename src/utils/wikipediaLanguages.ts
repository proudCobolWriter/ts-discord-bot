/*

    Data gathered from : https://meta.wikimedia.org/wiki/List_of_Wikipedias/Table
    Script used :

        const languages = [];
        const table = document.querySelector(".sortable.jquery-tablesorter tbody");

        const cleanStr = (str) => {
            return str.trim().toLowerCase();
        };

        for (const child of table.children) {
            const children = child.children;
            
            const lang = cleanStr(children[1].firstChild.textContent);
            const lang_loc = cleanStr(children[2].innerText);
            const code = cleanStr(children[3].firstChild.textContent);
            
            languages.push({lang, lang_loc, code})
        }

        console.log(JSON.stringify(languages));

    Date of dataset : 15 November 2022, at 01:14 (wikimedia)

*/

import fs from "fs/promises";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

export type WikiLanguage = {
	lang: string;
	lang_loc: string;
	code?: string;
};

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const PATH_TO_DATASET = path.resolve(
	CURRENT_DIR,
	"..",
	"..",
	"datasets",
	"wikipedia-languages.json"
);

let DATA: WikiLanguage[] = [];

try {
	const file = await fs.readFile(PATH_TO_DATASET);
	DATA = JSON.parse(file.toString());
} catch (err) {
	console.log(
		"Une erreur est survenue lors de la lecture du dataset wikipedia-languages.json :"
	);
	console.error(err);
}

const MAPPED_DATA: Map<string | undefined, WikiLanguage> = new Map();

DATA.forEach((x) => {
	MAPPED_DATA.set(x.code, { lang: x.lang, lang_loc: x.lang_loc });
});

export default MAPPED_DATA;
