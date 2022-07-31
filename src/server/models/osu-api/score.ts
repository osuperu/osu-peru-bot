import { OGamemodeName } from "./gamemode";
import { OBeatmap, OBeatmapset } from "./beatmap";
import { OUser } from "./user";
import { Timestamp } from "./timestamp";

export interface OScore {
	id: number;
	best_id: number;
	user_id: number;
	accuracy: number;
	mods: string[];
	mods_int: number;
	score: number;
	max_combo: number;
	perfect: boolean;
	statistics: OScoreStatistics;
	passed: boolean;
	pp: number;
	rank: string;
	created_at: Timestamp;
	mode: OGamemodeName;
	mode_int: number;
	replay: boolean;
	beatmap: OBeatmap;
	beatmapset: OBeatmapset;
	user?: OUser;
}

export interface OScores {
	scores: OScore[];
}

export interface OScoreStatistics {
	count_50: number;
	count_100: number;
	count_300: number;
	count_geki: number;
	count_katu: number;
	count_miss: number;
}
