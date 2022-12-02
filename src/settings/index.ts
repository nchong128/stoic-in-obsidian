import {App, PluginSettingTab, Setting} from "obsidian";
import type StoicInObsidianPlugin from "../main";
import type {SvelteComponent} from "svelte";
import SettingsRouter from "./components/Dashboard.svelte";

export interface IStoicInObsidianSettings {
	templatePath: string;

	morningReflectionEnabled: boolean;
	morningNoteFolderPath: string;
	morningFileFormat: string;
	morningShowDayFocusQuestions: boolean;

	eveningReflectionEnabled: boolean;
	eveningNoteFolderPath: string;
	eveningFileFormat: string;
	eveningShowEmotionQuestions:  boolean;
}

export const DEFAULT_SETTINGS: IStoicInObsidianSettings = {
	templatePath: "Templates/Evening Reflection.md",

	// Morning Reflections
	morningReflectionEnabled: true,
	morningNoteFolderPath: "Journals",
	morningFileFormat: "YYYY/[Morning Reflection-] DD-MM-YYYY",
	morningShowDayFocusQuestions: true,

	// Evening Reflections
	eveningReflectionEnabled: true,
	eveningNoteFolderPath: "Journals",
	eveningFileFormat: "YYYY/[Evening Reflection-] DD-MM-YYYY",
	eveningShowEmotionQuestions: true
}

export class StoicInObsidianSettingsTab extends PluginSettingTab {
	private plugin: StoicInObsidianPlugin;
	private view: SvelteComponent;

	constructor(app: App, plugin: StoicInObsidianPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		this.containerEl.empty();
		this.view = new SettingsRouter({
			target: this.containerEl,
			props: {
				app: this.app,
				settings: this.plugin.settings
			},
		});

	}

	hide() {
		super.hide();
		this.view.$destroy();
	}
}
