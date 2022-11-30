import {App, PluginSettingTab, Setting} from "obsidian";
import type StoicInObsidianPlugin from "../main";

export interface IStoicInObsidianSettings {
	templatePath: string;
	eveningNoteFolderPath: string;
	fileFormat: string;
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
	fileFormat: "YYYY/DD-MM-YYYY"
}

export class StoicInObsidianSettings extends PluginSettingTab {
	plugin: StoicInObsidianPlugin;

	constructor(app: App, plugin: StoicInObsidianPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h1', {text: 'stoic-in-obsidian'});

		new Setting(containerEl)
			.setName('file format')
			// .setDesc('')
			.addText(text => text
				.setPlaceholder(DEFAULT_SETTINGS.fileFormat)
				.setValue(this.plugin.settings.fileFormat)
				.onChange(async (value) => {
					console.log('File format changed: ' + value);
					this.plugin.settings.fileFormat = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('evening reflection enabled.')
			.addToggle(tog => tog
				.setValue(this.plugin.settings.eveningReflectionEnabled)
				.onChange(async (value) => {
					console.log('Evening reflection changed: ' + value);
					this.plugin.settings.eveningReflectionEnabled = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('show emotion questions')
			.addToggle(tog => tog
				.setValue(this.plugin.settings.showEmotionQuestionsEvening)
				.onChange(async (value) => {
					console.log('emotion questions changed: ' + value);
					this.plugin.settings.showEmotionQuestionsEvening = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('folder path')
			.setDesc('new evening reflections will be placed here')
			.addText(text => text
				.setPlaceholder(DEFAULT_SETTINGS.eveningNoteFolderPath)
				.setValue(this.plugin.settings.eveningNoteFolderPath)
				.onChange(async (value) => {
					console.log('evening reflection folder path changed: ' + value);
					this.plugin.settings.eveningNoteFolderPath = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('file format')
			// .setDesc('')
			.addText(text => text
				.setPlaceholder(DEFAULT_SETTINGS.fileFormat)
				.setValue(this.plugin.settings.fileFormat)
				.onChange(async (value) => {
					console.log('File format changed: ' + value);
					this.plugin.settings.fileFormat = value;
					await this.plugin.saveSettings();
				}));
	}
}
