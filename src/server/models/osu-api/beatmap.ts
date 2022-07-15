import { RankedStatus } from "./ranked-status"
import { OGamemode } from "./gamemode"
import { Failtimes } from "./failtimes"
import type { OUser, OUserCompact } from "./user";
import { Timestamp } from "./timestamp";

export interface OBeatmap extends OBeatmapCompact {
	accuracy: number;
	ar: number;
	beatmapset_id: number;
	user_id: number;
	bpm: number;
	convert: boolean;
	count_circles: number;
	count_sliders: number;
	count_spinners: number;
	cs: number;
	deleted_at?: Timestamp;
	drain: number;
	hit_length: number;
	is_scoreable: boolean;
	last_updated: Timestamp;
	mode_int: number;
	passcount: number;
	playcount: number;
	ranked: RankedStatus;
	url: string;
}

export interface OBeatmapCompact {
	difficulty_rating: number;
	id: number;
	mode: OGamemode;
	status: string;
	total_length: number;
	version: string;
	beatmapset?: null | OBeatmapset;
	checksum?: string;
	failtimes?: Failtimes;
	max_combo?: number;
}

export interface OBeatmapset extends OBeatmapsetCompactBase {
	availability: OBeatmapsetCompactAvailability;
	bpm: number;
	can_be_hyped: boolean;
	creator: string;
	discussion_enabled: boolean;
	discussion_locked: boolean;
	hype: null | OBeatmapsetCompactHype;
	is_scoreable: boolean;
	last_updated: Timestamp;
	legacy_thread_url?: string;
	nominations_summary: OBeatmapsetCompactNominationsSummary;
	ranked?: RankedStatus;
	ranked_date?: Timestamp;
	source?: string;
	storyboard: boolean;
	submitted_date?: Timestamp;
	tags: string;
	has_favourited: boolean;
}

export interface OBeatmapsetCompact extends OBeatmapsetCompactBase {
	source: string;
	has_favourited?: boolean;
}

export interface OBeatmapsetCompactBase {
	artist: string;
	artist_unicode: string;
	covers: OCovers;
	creator: string;
	favourite_count: number;
	id: number;
	nsfw: boolean;
	play_count: number;
	preview_url: string;
	status: string;
	title: string;
	title_unicode: string;
	user_id: number;
	video: boolean;
	beatmaps?: OBeatmap[];
	converts?: unknown;
	current_user_attributes?: unknown;
	description?: unknown;
	discussions?: OBeatmapsetDiscussion;
	events?: unknown;
	genre?: string;
	language?: string;
	nominations?: unknown;
	ratings?: number[];
	recent_favourites?: unknown;
	related_users?: unknown;
	user?: OUser;
}

export interface OBeatmapsetCompactAvailability {
	download_disabled: boolean;
	more_information?: string;
}

export interface OBeatmapsetCompactHype {
	current?: number;
	required?: number;
}

export interface OBeatmapsetCompactNominationsSummary {
	current?: number;
	required?: number;
}

export interface OBeatmapsetDiscussion {
	beatmaps: OBeatmap[];
	cursor_string: string;
	discussions: OBeatmapsetDiscussionCompact[];
	included_discussions: OBeatmapsetDiscussionCompact[];
	users: OUserCompact[];
}

export interface OBeatmapsetDiscussionCompact {
	beatmap?: OBeatmapCompact;
	beatmap_id: number;
	beatmapset: OBeatmapsetCompact;
	beatmapset_id: number;
	can_grant_kudosu: boolean;
	created_at: Timestamp;
	current_user_attributes: unknown;
	deleted_at: Timestamp;
	deleted_by_id: number;
	id: number;
	kudosu_denied: boolean;
	last_post_at: Timestamp;
	message_type: string;
	parent_id: number;
	posts: OBeatmapsetDiscussionPost[];
	resolved: boolean;
	starting_post: OBeatmapsetDiscussionPost;
	timestamp: number;
	updated_at: Timestamp;
	user_id: number;
}

export interface OCovers {
	cover: string;
	"cover@2x": string;
	card: string;
	"card@2x": string;
	list: string;
	"list@2x": string;
	slimcover: string;
	"slimcover@2x": string;
}

export interface OBeatmapsetDiscussionPost {
	beatmapsets: OBeatmapsetCompact[];
	discussions: [OBeatmapsetDiscussionCompact];
	posts: [OBeatmapsetDiscussionPostCompact];
}

export interface OBeatmapsetDiscussionPostCompact {
	beatmapset_discussion_id: number;
	created_at: Timestamp;
	deleted_at: Timestamp;
	deleted_by_id: number;
	id: number;
	last_editor_id: number;
	message: string;
	system: boolean;
	updated_at: Timestamp;
	user_id: number;
}
