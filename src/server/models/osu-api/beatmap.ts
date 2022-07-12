import { RankedStatus } from "./ranked-status"
import { OGamemode } from "./gamemode"
import { Failtimes } from "./failtimes"
import type { OUser, OUserCompact } from "./user";

export interface Beatmap extends BeatmapCompact {
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
	deleted_at?: Date;
	drain: number;
	hit_length: number;
	is_scoreable: boolean;
	last_updated: Date;
	mode_int: number;
	passcount: number;
	playcount: number;
	ranked: RankedStatus;
	url: string;
}

export interface BeatmapCompact {
	difficulty_rating: number;
	id: number;
	mode: OGamemode;
	status: string;
	total_length: number;
	version: string;
	beatmapset?: null | Beatmapset;
	checksum?: string;
	failtimes?: Failtimes;
	max_combo?: number;
}

export interface Beatmapset extends BeatmapsetCompactBase {
	availability: BeatmapsetCompactAvailability;
	bpm: number;
	can_be_hyped: boolean;
	creator: string;
	discussion_enabled: boolean;
	discussion_locked: boolean;
	hype: null | BeatmapsetCompactHype;
	is_scoreable: boolean;
	last_updated: Date;
	legacy_thread_url?: string;
	nominations_summary: BeatmapsetCompactNominationsSummary;
	ranked?: RankedStatus;
	ranked_date?: Date;
	source?: string;
	storyboard: boolean;
	submitted_date?: Date;
	tags: string;
	has_favourited: boolean;
}

export interface BeatmapsetCompact extends BeatmapsetCompactBase {
	source: string;
	has_favourited?: boolean;
}

export interface BeatmapsetCompactBase {
	artist: string;
	artist_unicode: string;
	covers: Covers;
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
	beatmaps?: Beatmap[];
	converts?: unknown;
	current_user_attributes?: unknown;
	description?: unknown;
	discussions?: BeatmapsetDiscussion;
	events?: unknown;
	genre?: string;
	language?: string;
	nominations?: unknown;
	ratings?: number[];
	recent_favourites?: unknown;
	related_users?: unknown;
	user?: OUser;
}

export interface BeatmapsetCompactAvailability {
	download_disabled: boolean;
	more_information?: string;
}

export interface BeatmapsetCompactHype {
	current?: number;
	required?: number;
}

export interface BeatmapsetCompactNominationsSummary {
	current?: number;
	required?: number;
}

export interface BeatmapsetDiscussion {
	beatmaps: Beatmap[];
	cursor_string: string;
	discussions: BeatmapsetDiscussionCompact[];
	included_discussions: BeatmapsetDiscussionCompact[];
	users: OUserCompact[];
}

export interface BeatmapsetDiscussionCompact {
	beatmap?: BeatmapCompact;
	beatmap_id: number;
	beatmapset: BeatmapsetCompact;
	beatmapset_id: number;
	can_grant_kudosu: boolean;
	created_at: Date;
	current_user_attributes: unknown;
	deleted_at: Date;
	deleted_by_id: number;
	id: number;
	kudosu_denied: boolean;
	last_post_at: Date;
	message_type: string;
	parent_id: number;
	posts: BeatmapsetDiscussionPost[];
	resolved: boolean;
	starting_post: BeatmapsetDiscussionPost;
	timestamp: number;
	updated_at: Date;
	user_id: number;
}

export interface Covers {
	cover: string;
	"cover@2x": string;
	card: string;
	"card@2x": string;
	list: string;
	"list@2x": string;
	slimcover: string;
	"slimcover@2x": string;
}

export interface BeatmapsetDiscussionPost {
	beatmapsets: BeatmapsetCompact[];
	discussions: [BeatmapsetDiscussionCompact];
	posts: [BeatmapsetDiscussionPostCompact];
}

export interface BeatmapsetDiscussionPostCompact {
	beatmapset_discussion_id: number;
	created_at: Date;
	deleted_at: Date;
	deleted_by_id: number;
	id: number;
	last_editor_id: number;
	message: string;
	system: boolean;
	updated_at: Date;
	user_id: number;
}
