import type {App} from "obsidian";
import {normalizePath} from "obsidian";

export function validateFolder(app: App, folder: string): string {
	if (!folder || folder === "/") {
		return "";
	}

	if (!app.vault.getAbstractFileByPath(normalizePath(folder))) {
		return "Folder not found in vault";
	}

	return "";
}
