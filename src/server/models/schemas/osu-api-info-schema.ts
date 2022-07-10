export interface CodeExchangeSchema {
	token_type: "Bearer";
	expires_in: number;
	access_token: string;
	refresh_token?: string;
}

export interface OAuthUserSchema {
	country_code: string;
	avatar_url: string;
	username: string;
	playmode: "osu" | "mania" | "fruits" | "taiko";
	groups: OAuthUserGroupSchema[];
	ranked_beatmapset_count: number;
	is_restricted: boolean;
}

export interface OAuthUserGroupSchema {
	id: number;
	identifier: string;
	name: string;
	short_name: string;
	description: string;
	colour: string;
}

export interface OUserSchema {
	avatar_url: string;
	id: number;
	username: string;
	kudosu: OKudosuSchema;
	playmode: "osu" | "mania" | "fruits" | "taiko";
	country: OUserCountrySchema;
	statistics: OUserStatisticsSchema;
	previous_usernames: string[];
	graveyard_beatmapset_count: number;
	guest_beatmapset_count: number;
	loved_beatmapset_count: number;
	pending_beatmapset_count: number;
	ranked_and_approved_beatmapset_count: number;
	unranked_beatmapset_count: number;
}

export interface OKudosuSchema {
	total: number;
	available: number;
}

export interface OUserCountrySchema {
	code: string;
	name: string;
}

export interface OUserStatisticsSchema {
	level: OUserLevelSchema;
	global_rank: number;
	pp: number;
	hit_accuracy: number;
	play_count: number;
	play_time: number;
	rank: OUserRankSchema;
}

export interface OUserLevelSchema {
	current: number;
	progress: number;
}

export interface OUserRankSchema {
	country: string;
}
