import {App, PluginSettingTab, Setting} from "obsidian";
import type StoicInObsidianPlugin from "../main";
import type {SvelteComponent} from "svelte";
import SettingsRouter from "./components/Router.svelte";

export interface IStoicInObsidianSettings {
	templatePath: string;
	eveningNoteFolderPath: string;
	eveningFileFormat: string;
	morningReflectionEnabled: boolean;
	eveningReflectionEnabled: boolean;
	showEmotionQuestionsEvening:  boolean;
}

export const DEFAULT_SETTINGS: IStoicInObsidianSettings = {
	templatePath: "Templates/Evening Reflection.md",

	// Morning Reflections
	morningReflectionEnabled: false,

	// Evening Reflections
	eveningReflectionEnabled: true,
	showEmotionQuestionsEvening: true,
	eveningNoteFolderPath: "Journals",
	eveningFileFormat: "YYYY/[Evening Reflection-] DD-MM-YYYY"
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
