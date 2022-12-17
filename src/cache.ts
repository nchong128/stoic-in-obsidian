import type {Moment} from "moment";
import memoize from "lodash/memoize";
import {
	App,
	CachedMetadata,
	Component,
	TAbstractFile,
	TFile,
	TFolder
} from "obsidian";
import type StoicInObsidianPlugin from "./main";
import type {IStoicInObsidianSettings} from "./settings";
import {appendFile} from "fs";
import type {Note} from "esbuild";
import {type NoteType, RESOLVE_EVENT, SETTINGS_UPDATED_EVENT} from "./constants";
import moment from "moment";
import {findNoteType} from "./utils";

export interface NoteCachedMetadata {
	filePath: string;
	date: Moment;
	noteType: NoteType;
	// canonicalDateStr: string;
	// matchData: NoteMatchData;
}

export type MatchType = "filename" | "frontmatter" | "date-prefixed";

export interface NoteMatchData {
	matchType: MatchType;
	exact: boolean;
}

export class NotesCache extends Component {
	// Maps from file name to NoteCachedMetadata
	public cachedFiles: Map<string, NoteCachedMetadata>;
	private readonly plugin: StoicInObsidianPlugin;

	constructor(readonly app: App, readonly plugin: StoicInObsidianPlugin) {
		super();
		this.cachedFiles = new Map();
		this.plugin = plugin;

		this.app.workspace.onLayoutReady(() => {
			console.info("SiO: initialising cache");
			this.initialize();

			// Register events
			this.registerEvent(this.app.vault.on("create", this.resolve, this));
			this.registerEvent(this.app.vault.on("rename", this.resolveRename, this));
			this.registerEvent(this.app.metadataCache.on("changed", this.resolveChangedMetadata, this));
			this.registerEvent(this.app.workspace.on( SETTINGS_UPDATED_EVENT, this.reset, this));
		})
	}

	public initialize(): void {
		const memoizedRecurseChildren = memoize(
			(rootFolder: TFolder, cb: (file: TAbstractFile) => void) => {
				if (!rootFolder) return;

				for (const c of rootFolder.children) {
					if (c instanceof TFile) {
						cb(c);
					} else if (c instanceof TFolder) {
						memoizedRecurseChildren(c, cb);
					}
				}
			}
		);

		const config = this.plugin.settings as IStoicInObsidianSettings;

		// Find root folder of journals
		const rootFolder = this.app.vault.getAbstractFileByPath(
			config.noteFolderPath || "/"
		) as TFolder;

		// Scan for filename matches
		memoizedRecurseChildren(rootFolder, (file: TAbstractFile) => {
			if (file instanceof TFile) {
				this.resolve(file, "initialize");
				const metadata = app.metadataCache.getFileCache(file);

				// console.debug(`SiO: found metadata for file ${file.name}: ${JSON.stringify(metadata)}`);
				if (metadata) {
					this.resolveChangedMetadata(file, "", metadata);
				}
			}
		});
	}

	public reset(): void {
		console.info("SiO: resetting cache");
		this.cachedFiles.clear();
		this.initialize();
	}

	private resolveRename(file: TAbstractFile, oldPath: string): void {
		for (const [filePath, cachedData] of this.cachedFiles) {
			if (file instanceof TFile) {
				this.cachedFiles.delete(oldPath);
				this.resolve(file, "rename");
			}
		}
	}

	// TODO: Worry about this later when implementing integration with periodic-notes
	private resolveChangedMetadata(
		file: TFile,
		_data: string,
		cache: CachedMetadata
	): void {
	//
	// 	const manager = this.plugin.calendarSetManager;
	// 	// Check if file matches any calendar set
	// 	calendarsets: for (const calendarSet of manager.getCalendarSets()) {
	// 		const activeGranularities = granularities.filter((g) => calendarSet[g]?.enabled);
	// 		if (activeGranularities.length === 0) continue calendarsets;
	//
	// 		granularities: for (const granularity of activeGranularities) {
	// 			const folder = calendarSet[granularity]?.folder || "";
	// 			if (!file.path.startsWith(folder)) continue granularities;
	// 			const frontmatterEntry = parseFrontMatterEntry(cache.frontmatter, granularity);
	// 			if (!frontmatterEntry) continue granularities;
	//
	// 			const format = DEFAULT_FORMAT[granularity];
	// 			let date: Moment;
	// 			if (typeof frontmatterEntry === "string") {
	// 				// e.g. `day: 2022-02-02`
	// 				date = window.moment(frontmatterEntry, format, true);
	// 				if (date.isValid()) {
	// 					this.set(calendarSet.id, file.path, {
	// 						calendarSet: calendarSet.id,
	// 						filePath: file.path,
	// 						date,
	// 						granularity,
	// 						canonicalDateStr: getCanonicalDateString(granularity, date),
	// 						matchData: {
	// 							exact: true,
	// 							matchType: "frontmatter",
	// 						},
	// 					});
	// 				} else {
	// 					// TODO: custom format?
	// 					// semester:
	// 					//   start_date: X
	// 					//   end_date: Y
	// 					//
	// 				}
	//
	// 				continue calendarsets;
	// 			}
	// 		}
		}


	private getCanonicalDateString(date: Moment): string {
		return date.toISOString();
	}

	private async resolve(file: TFile, reason: "create" | "rename" | "initialize" = "create"): void {
		// 1. Find the noteType based on the file name (e.g. Evening Reflection -> evening-reflection type)
		const noteType : NoteType = await findNoteType(file.name, this.plugin);

		console.debug(`note type ${noteType}`);

		// 2. Create file metadata and set at file.path
		this.cachedFiles.set(file.path, {
			filePath: file.path,
			date: moment(file.stat.ctime),
			noteType
		} as NoteCachedMetadata);

		this.app.workspace.trigger(
			RESOLVE_EVENT,
			file
		);

		const res = this.cachedFiles.get(file.path);
		console.debug(`SiO: successfully resolved file ${file.name} with reason ${reason} and result ${JSON.stringify(res)}`);
	}

	/**
	 * Retrieve a note from the cache, or null
	 * @param currentDate
	 * @param noteType
	 */
	public getNote(currentDate: Moment): TFile | null {
		// Finding note
		for (const [filePath, cachedData] of this.cachedFiles) {
			console.debug(`comparing ${currentDate} with ${cachedData.date} from ${filePath}`);

			// checks if current date matches the note's date
			if (cachedData.date.isSame(currentDate, 'day') && cachedData.noteType) {
				console.debug(`found cached note in file path ${filePath}`);
				return this.app.vault.getAbstractFileByPath(filePath) as TFile;
			}
		}
		console.log("SiO: No cached note found");
		return null;
	}
}
