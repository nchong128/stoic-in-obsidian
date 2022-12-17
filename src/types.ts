export type NoteType = "blank-page"
	| "morning-reflection"
	| "evening-reflection"
	| "daily-questions";

export const noteTypesToMatchKey =  {
	"morning-reflection": /morning/i ,
	"evening-reflection": /evening/i
};
