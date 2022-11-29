import {App, PluginSettingTab, Setting} from "obsidian";
import type StoicInObsidianPlugin from "./main";

export class SampleSettingTab extends PluginSettingTab {
	plugin: StoicInObsidianPlugin;

	constructor(app: App, plugin: StoicInObsidianPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Stoic in Obsidian'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
