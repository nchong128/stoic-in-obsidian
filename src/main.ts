import {App, Editor, MarkdownView, Modal, normalizePath, Notice, Plugin, TFile} from 'obsidian';
import {DEFAULT_SETTINGS, StoicInObsidianSettingsTab} from "./settings";
import type { IStoicInObsidianSettings } from "./settings";
import type { Moment } from "moment";
import {applyTemplateTransformations, getNoteCreationPath, getTemplateContents} from "./utils";
import {EVENING_REFLECTION_STARTING_MESSAGE} from "./constants";
import {NotesCache} from "./cache";

export default class StoicInObsidianPlugin extends Plugin {
	private cache: NotesCache;
	settings: IStoicInObsidianSettings;

	async onload() {
		await this.loadSettings();

		this.cache = new NotesCache(this.app, this);

		this.openEveningReflection = this.openEveningReflection.bind(this);

		console.log("App ", this.app);

		// Add settings tab
		this.addSettingTab(new StoicInObsidianSettingsTab(this.app, this));

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('pen-tool', 'stoic in obsidian', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice(EVENING_REFLECTION_STARTING_MESSAGE);
			this.openEveningReflection(window.moment())
		});

		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const streakItemEl = this.addStatusBarItem();

		// Evening reflection command
		this.addCommand({
			id: 'open-new-evening-reflection',
			name: "open today's evening reflection",
			callback: () => {
				new Notice(EVENING_REFLECTION_STARTING_MESSAGE);
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
		const filename = date.format(this.settings.eveningFileFormat);

		// Retrieve template and fill with content
		const templateContents = await getTemplateContents(this.app, this.settings.templatePath);
		const renderedContents = applyTemplateTransformations(
			filename,
			date,
			this.settings.eveningFileFormat,
			templateContents
		);

		// Create the filled template
		const destPath = await getNoteCreationPath(this.app, filename, this.settings.eveningNoteFolderPath);
		return this.app.vault.create(destPath, renderedContents);
	}

	public async openEveningReflection(date: Moment): Promise<void> {
		const { workspace } = this.app;

		let file = this.cache.getNote(date);

		if (!file) {
			console.log("SiO: No file found. Creating...");
			file = await this.createEveningReflection(date);
		}

		const leaf = workspace.getLeaf(false);
		await leaf.openFile(file, {active: true});
	}

}

