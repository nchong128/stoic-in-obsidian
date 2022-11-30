import {App, Editor, MarkdownView, Modal, normalizePath, Notice, Plugin, TFile} from 'obsidian';
import {DEFAULT_SETTINGS, StoicInObsidianSettings} from "./settings";
import type { IStoicInObsidianSettings } from "./settings";
import type { Moment } from "moment";
import {applyTemplateTransformations, getNoteCreationPath, getTemplateContents} from "./utils";

export default class StoicInObsidianPlugin extends Plugin {
	settings: IStoicInObsidianSettings;

	async onload() {
		await this.loadSettings();

		this.openEveningReflection = this.openEveningReflection.bind(this);

		console.log(this.app);

		// Add settings tab
		this.addSettingTab(new StoicInObsidianSettings(this.app, this));

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('pen-tool', 'Stoic-in-Obsidian', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('Starting a new evening reflection');
			this.openEveningReflection(window.moment())
		});

		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const streakItemEl = this.addStatusBarItem();

		function getCurrentStreak() {

		}

		streakItemEl.setText(`Streak: ${getCurrentStreak()}`);

		// Evening reflection command
		this.addCommand({
			id: 'open-new-evening-reflection',
			name: "Open today's evening reflection",
			callback: () => {
				new Notice('Starting a new evening reflection');
				this.openEveningReflection(window.moment())
			}
		});

		// This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });
		//
		// // This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}
		//
		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}


	public async createEveningReflection(date: Moment): Promise<TFile> {
		const filename = `${date.format("YYYY")}/Evening Reflection- ${date.format("DD-MM-YYYY")}`;

		// Retrieve template and fill with content
		const templateContents = await getTemplateContents(this.app, this.settings.templatePath);
		const renderedContents = applyTemplateTransformations(
			filename,
			date,
			this.settings.fileFormat,
			templateContents
		);

		// Create the filled template
		const destPath = await getNoteCreationPath(this.app, filename, this.settings.eveningNoteFolderPath);
		return this.app.vault.create(destPath, renderedContents);
	}

	public async openEveningReflection(date: Moment): Promise<void> {
		const inNewSplit = true;
		const { workspace } = this.app;
		let file = await this.createEveningReflection(date);
		const leaf = workspace.getLeaf(false).openFile(file, {active: true});
	}

}
//
// class SampleModal extends Modal {
// 	constructor(app: App) {
// 		super(app);
// 	}
//
// 	onOpen() {
// 		const {contentEl} = this;
// 		contentEl.setText('Woah!');
// 	}
//
// 	onClose() {
// 		const {contentEl} = this;
// 		contentEl.empty();
// 	}
// }
