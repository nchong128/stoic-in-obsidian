import {App, normalizePath, Notice} from "obsidian";
import type {Moment} from "moment";

export async function getNoteCreationPath(
	app: App,
	filename: string,
	noteFolderPath: string
): Promise<string> {
	const directory = noteFolderPath ?? "";
	const filenameWithExt = !filename.endsWith(".md") ? `${filename}.md` : filename;

	const path = normalizePath(join(directory, filenameWithExt));
	await ensureFolderExists(app, path);
	return path;
}

/**
 * Checks if a folder exists given a path. This function also splits any backslashes into folder paths.
 * If no folder is found, it will create it.
 * @param app
 * @param path
 */
async function ensureFolderExists(app: App, path: string): Promise<void> {
	const dirs = path.replace(/\\/g, "/").split("/");
	dirs.pop(); // remove basename

	if (dirs.length) {
		const dir = join(...dirs);
		if (!app.vault.getAbstractFileByPath(dir)) {
			await app.vault.createFolder(dir);
		}
	}
}

/**
 * Retrieves the template used for a note, returning the text
 * @param app
 * @param templatePath
 * @private
 */
export async function getTemplateContents(
	app: App,
	templatePath: string | undefined
): Promise<string> {

		const { metadataCache, vault } = app;
		const normalizedTemplatePath = normalizePath(templatePath ?? "");
		if (templatePath === "/") {
		return Promise.resolve("");
	}

	try {
		const templateFile = metadataCache.getFirstLinkpathDest(normalizedTemplatePath, "");
		return templateFile ? vault.cachedRead(templateFile) : "";
	} catch (err) {
		console.error(
			`Failed to read the note template '${normalizedTemplatePath}'`,
			err
		);
		new Notice("Failed to read the note template");
		return "";
	}
}

export function applyTemplateTransformations(  filename: string,
	date: Moment,
	format: string,
	rawTemplateContents: string) {
	let templateContents = rawTemplateContents;

	templateContents = rawTemplateContents
		.replace(/{{\s*date\s*}}/gi, filename)
		.replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm"))
		.replace(/{{\s*title\s*}}ß/gi, filename);

	// Make day-granular transformations
	templateContents = templateContents
		.replace(/{{\s*yesterday\s*}}/gi, date.clone().subtract(1, "day").format(format))
		.replace(/{{\s*tomorrow\s*}}/gi, date.clone().add(1, "d").format(format))
		.replace(
			/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi,
			(_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
				const now = window.moment();
				const currentDate = date.clone().set({
					hour: now.get("hour"),
					minute: now.get("minute"),
					second: now.get("second"),
				});
				if (calc) {
					currentDate.add(parseInt(timeDelta, 10), unit);
				}

				if (momentFormat) {
					return currentDate.format(momentFormat.substring(1).trim());
				}
				return currentDate.format(format);
			}
		);

	return templateContents;
}

// Credit: @creationix/path.js
export function join(...partSegments: string[]): string {
	// Split the inputs into a list of path commands.
	let parts: string[] = [];
	for (let i = 0, l = partSegments.length; i < l; i++) {
		parts = parts.concat(partSegments[i].split("/"));
	}
	// Interpret the path commands to get the new resolved path.
	const newParts = [];
	for (let i = 0, l = parts.length; i < l; i++) {
		const part = parts[i];
		// Remove leading and trailing slashes
		// Also remove "." segments
		if (!part || part === ".") continue;
		// Push new path segments.
		else newParts.push(part);
	}
	// Preserve the initial slash if there was one.
	if (parts[0] === "") newParts.unshift("");
	// Turn back into a single string path.
	return newParts.join("/");
}
