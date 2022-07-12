import { OGamemodeName } from "./gamemode";
import { Beatmap, Beatmapset } from "./beatmap";
import { OUser } from "./user";

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
	created_at: Date;
	mode: OGamemodeName;
	mode_int: number;
	replay: boolean;
	beatmap: Beatmap;
	beatmapset: Beatmapset;
	user?: OUser;
}

export interface OScoreStatistics {
	count_50: number;
	count_100: number;
	count_300: number;
	count_geki: number;
	count_katu: number;
	count_miss: number;
}
