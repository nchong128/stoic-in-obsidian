import {App, PluginSettingTab, Setting} from "obsidian";
import type StoicInObsidianPlugin from "../main";
import type {SvelteComponent} from "svelte";
import SettingsRouter from "./components/Dashboard.svelte";

export interface IStoicInObsidianSettings {
	templatePath: string;
	noteFolderPath: string;

	morningReflectionEnabled: boolean;
	morningFileFormat: string;
	morningShowDayFocusQuestions: boolean;

	eveningReflectionEnabled: boolean;
	eveningFileFormat: string;
	eveningShowEmotionQuestions:  boolean;
}

export const DEFAULT_SETTINGS: IStoicInObsidianSettings = {
	templatePath: "Templates/Evening Reflection.md",
	noteFolderPath: "Journals",

	// Morning Reflections
	morningReflectionEnabled: true,
	morningFileFormat: "YYYY/YYYY-MM-DD [(Morning Reflection)]",
	morningShowDayFocusQuestions: true,

	// Evening Reflections
	eveningReflectionEnabled: true,
	eveningFileFormat: "YYYY/YYYY-MM-DD [(Evening Reflection)]",
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
