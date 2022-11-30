import {App, Editor, MarkdownView, Modal, normalizePath, Notice, Plugin, TFile} from 'obsidian';
import {SampleSettingTab} from "./settings";
import type { Moment } from "moment";
import {getNoteCreationPath} from "./utils";

// Remember to rename these classes and interfaces!

interface IStoicInObsidianSettings {
	templatePath: string;
	noteFolderPath: string;
	fileFormat: string;
	eveningReflectionEnabled: boolean;
}

const DEFAULT_SETTINGS: IStoicInObsidianSettings = {
	templatePath: "Templates/Evening Reflection.md",
	noteFolderPath: "Journals",
	fileFormat: "YYYY/DD-MM-YYYY",
	eveningReflectionEnabled: true
}

export default class StoicInObsidianPlugin extends Plugin {
	settings: IStoicInObsidianSettings;

	async onload() {
		await this.loadSettings();

		this.openEveningReflection = this.openEveningReflection.bind(this);

		console.log(this.app);

		// Add settings tab
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('pen-tool', 'Stoic-in-Obsidian', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('Starting evening reflection');
			this.openEveningReflection(window.moment())
		});

		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});

		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});


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

	/**
	 * Finds the template used for a note
	 * @param app
	 * @param templatePath
	 * @private
	 */
	private async getTemplateContents(
		app: App,
		templatePath: string | undefined
	): Promise<string> {

		const { metadataCache, vault } = app;
		const normalizedTemplatePath = normalizePath(templatePath ?? "");
		if (templatePath === "/") {
			return Promise.resolve("");
		}

		try {
			const templateFile = metadataCache.getFirstLinkpathDest(normalizedTemplatePath, "");
			return templateFile ? vault.cachedRead(templateFile) : "";
		} catch (err) {
			console.error(
				`Failed to read the evening note template '${normalizedTemplatePath}'`,
				err
			);
			new Notice("Failed to read the evening note template");
			return "";
		}
	}

	private applyTemplateTransformations(  filename: string,
																				 date: Moment,
																				 format: string,
																				 rawTemplateContents: string) {
		let templateContents = rawTemplateContents;

		templateContents = rawTemplateContents
			.replace(/{{\s*date\s*}}/gi, filename)
			.replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm"))
			.replace(/{{\s*title\s*}}ß/gi, filename);

		// Make day-granular transformations
		templateContents = templateContents
			.replace(/{{\s*yesterday\s*}}/gi, date.clone().subtract(1, "day").format(format))
			.replace(/{{\s*tomorrow\s*}}/gi, date.clone().add(1, "d").format(format))
			.replace(
				/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi,
				(_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
					const now = window.moment();
					const currentDate = date.clone().set({
						hour: now.get("hour"),
						minute: now.get("minute"),
						second: now.get("second"),
					});
					if (calc) {
						currentDate.add(parseInt(timeDelta, 10), unit);
					}

					if (momentFormat) {
						return currentDate.format(momentFormat.substring(1).trim());
					}
					return currentDate.format(format);
				}
			);

		return templateContents;
	}



	public async createEveningReflection(date: Moment): Promise<TFile> {
		const filename = `${date.format("YYYY")}/Evening Reflection- ${date.format("DD-MM-YYYY")}`;
		const templateContents = await this.getTemplateContents(this.app, this.settings.templatePath);
		const renderedContents = this.applyTemplateTransformations(
			filename,
			date,
			this.settings.fileFormat,
			templateContents
		);
		const destPath = await getNoteCreationPath(this.app, filename, this.settings.noteFolderPath);
		return this.app.vault.create(destPath, renderedContents);
	}

	public async openEveningReflection(date: Moment): Promise<void> {
		const inNewSplit = true;
		const { workspace } = this.app;
		let file = await this.createEveningReflection(date);
		const leaf = workspace.getLeaf(false).openFile(file, { active: true});
	}

}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}
