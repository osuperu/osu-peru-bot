import { OGamemodeName } from "./gamemode";

export interface OUser extends OUserCompactBase {
	discord?: string;
	has_supported: boolean;
	interests?: string;
	join_date: Date;
	kudosu: OUserCompactKudosu;
	location?: string;
	max_blocks?: number;
	max_friends: number;
	occupation?: string;
	playmode: OGamemodeName;
	playstyle: string[];
	post_count: number;
	profile_order: OProfilePage[];
	title?: string;
	title_url?: string;
	twitter?: string;
	website?: string;
	cover: OUserCompactCover;
	country: OUserCompactCountry;
	is_restricted: boolean;
}

export interface OUserCompact extends OUserCompactBase {
	country?: OUserCompactCountry;
	cover?: OUserCompactCover;
	is_restricted?: boolean;
}

export interface OUserCompactBase {
	avatar_url: string;
	country_code: string;
	default_group: string;
	id: number;
	is_active: boolean;
	is_bot: boolean;
	is_deleted: boolean;
	is_online: boolean;
	is_supporter: boolean;
	last_visit?: Date;
	pm_friends_only: boolean;
	profile_colour: string;
	username: string;
	account_history?: OUserAccountHistory[];
	active_tournament_banner?: OUserCompactProfileBanner;
	badges?: OUserBadge[];
	beatmap_playcounts_count?: number;
	blocks?: unknown;
	favourite_beatmapset_count?: number;
	follower_count?: number;
	friends?: unknown;
	groups?: OUserGroup[];
	monthly_playcounts?: OUserMonthlyPlaycount[];
	page?: unknown;
	previous_usernames?: string[];
	rank_history?: {
		data?: number[];
	};
	replays_watched_counts?: number;
	scores_best_count?: number;
	scores_first_count?: number;
	scores_recent_count?: number;
	statistics?: OUserCompactStatistics;
	statistics_rulesets: OUserStatisticsRulesets;
	support_level?: unknown;
	unread_pm_count?: unknown;
	user_achievements?: OUserAchievement[];
	user_preferences?: unknown;
	ranked_and_approved_beatmapset_count?: number;
	guest_beatmapset_count: number;
	graveyard_beatmapset_count?: number;
	unranked_beatmapset_count: number;
	ranked_beatmapset_count?: number;
	loved_beatmapset_count?: number;
	pending_beatmapset_count?: number;
}

export interface OUserAccountHistory {
	todo?: boolean;
}

export interface OUserCompactProfileBanner {
	todo?: boolean;
}

export interface OUserBadge {
	todo?: boolean;
}

export interface OUserGroup {
	colour: string;
	has_listing: boolean;
	has_playmodes: boolean;
	id: number;
	identifier: string;
	is_probationary: boolean;
	name: string;
	short_name: string;
}

export interface OUserMonthlyPlaycount {
	todo?: boolean;
}

export interface OUserCompactKudosu {
	available: number;
	total: number;
}

export interface OProfilePage {
	me: unknown;
	recent_activity: unknown;
	beatmaps: unknown;
	historical: unknown;
	kudosu: unknown;
	top_ranks: unknown;
	medals: unknown;
}

export interface OUserCompactCover {
	custom_url?: string;
	url: string;
	id: string;
}

export interface OUserCompactCountry {
	code: string;
	name: string;
}

export interface OUserCompactStatistics {
	level: OUserCompactStatisticsLevel;
	global_rank: number;
	pp: number;
	ranked_score: number;
	hit_accuracy: number;
	play_count: number;
	play_time: number;
	total_score: number;
	total_hits: number;
	maximum_combo: number;
	replays_watched_by_others: number;
	is_ranked: true;
	grade_counts: OUserCompactStatisticsGradeCounts;
	country_rank: number;
	rank: OUserCompactStatisticsRank;
}

export interface OUserStatisticsRulesets {
	todo?: boolean;
}

export interface OUserAchievement {
	achieved_at: Date;
	achievement_id: number;
}

export interface OUserCompactStatisticsLevel {
	current: number;
	progress: number;
}

export interface OUserCompactStatisticsGradeCounts {
	ss: number;
	ssh: number;
	s: number;
	sh: number;
	a: number;
}

export interface OUserCompactStatisticsRank {
	country: string;
}
