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
		//
		// containerEl.createEl('h1', {text: 'stoic-in-obsidian'});
		//
		//
		// new Setting(containerEl)
		// 	.setName('evening reflection enabled')
		// 	.addToggle(tog => tog
		// 		.setValue(this.plugin.settings.eveningReflectionEnabled)
		// 		.onChange(async (value) => {
		// 			console.log('evening reflection changed: ' + value);
		// 			this.plugin.settings.eveningReflectionEnabled = value;
		// 			await this.plugin.saveSettings();
		// 		}));
		//
		// new Setting(containerEl)
		// 	.setName('evening file format')
		// 	// .setDesc('')
		// 	.addText(text => text
		// 		.setPlaceholder(DEFAULT_SETTINGS.eveningFileFormat)
		// 		.setValue(this.plugin.settings.eveningFileFormat)
		// 		.onChange(async (value) => {
		// 			console.log('evening file format changed: ' + value);
		// 			this.plugin.settings.eveningFileFormat = value;
		// 			await this.plugin.saveSettings();
		// 		}));
		//
		// new Setting(containerEl)
		// 	.setName('folder path')
		// 	.setDesc('new evening reflections will be placed here')
		// 	.addText(text => text
		// 		.setPlaceholder(DEFAULT_SETTINGS.eveningNoteFolderPath)
		// 		.setValue(this.plugin.settings.eveningNoteFolderPath)
		// 		.onChange(async (value) => {
		// 			console.log('evening reflection folder path changed: ' + value);
		// 			this.plugin.settings.eveningNoteFolderPath = value;
		// 			await this.plugin.saveSettings();
		// 		}));
		//
		// new Setting(containerEl)
		// 	.setName('show emotion questions')
		// 	.addToggle(tog => tog
		// 		.setValue(this.plugin.settings.showEmotionQuestionsEvening)
		// 		.onChange(async (value) => {
		// 			console.log('emotion questions changed: ' + value);
		// 			this.plugin.settings.showEmotionQuestionsEvening = value;
		// 			await this.plugin.saveSettings();
		// 		}));

	}

	hide() {
		super.hide();
		this.view.$destroy();
	}
}
