import {App, normalizePath} from "obsidian";

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
 * Checks if a folder exists given a path. If no folder is found, it will create it.
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
