import { OGamemodeName } from "./gamemode";
import { Timestamp } from "./timestamp";

export interface OEvent {
	created_at: Timestamp;
	id: number;
	type: OEventType;
}

export interface OEventBeatmap {
	title: string;
	url: string;
}

export interface OEventBeatmapset {
	title: string;
	url: string;
}

export interface OEventUser {
	username: string;
	url: string;
	previousUsername?: string;
}

export interface OEventAchievement extends OEvent {
	achievement: OAchievement;
	user: OEventUser;
}

export interface OEventBeatmapPlaycount extends OEvent {
	count: number;
}

export interface OEventBeatmapsetApprove extends OEvent {
	approval: OEventBeatmapApproval;
	beatmapset: OEventBeatmapset;
	user: OEventUser;
}

export interface OEventBeatmapsetDelete extends OEvent {
	beatmapset: OEventBeatmapset;
}

export interface OEventBeatmapsetRevive extends OEvent {
	beatmapset: OEventBeatmapset;
	user: OEventUser;
}

export interface OEventBeatmapsetUpdate extends OEvent {
	beatmapset: OEventBeatmapset;
	user: OEventUser;
}

export interface OEventBeatmapsetUpload extends OEvent {
	beatmapset: OEventBeatmapset;
	user: OEventUser;
}

export interface OEventRank extends OEvent {
	scoreRank: string;
	rank: number;
	mode: OGamemodeName;
	beatmap: OEventBeatmap;
	user: OEventUser;
}

export interface OEventRankLost extends OEvent {
	mode: OGamemodeName;
	beatmap: OEventBeatmap;
	user: OEventUser;
}

export interface OEventUserSupportAgain extends OEvent {
	user: OEventUser;
}

export interface OEventUserSupportFirst extends OEvent {
	user: OEventUser;
}

export interface OEventUserSupportGift extends OEvent {
	user: OEventUser;
}

export interface OEventUsernameChange extends OEvent {
	user: OEventUser;
}

export interface OAchievement {
	icon_url: string;
	id: number;
	name: string;
	grouping: string;
	ordering: number;
	slug: string;
	description: string;
	mode: OGamemodeName;
	instructions: string;
}

export type OEventType =
	| "achievement"
	| "beatmapPlaycount"
	| "beatmapsetApprove"
	| "beatmapsetDelete"
	| "beatmapsetRevive"
	| "beatmapsetUpdate"
	| "beatmapsetUpload"
	| "rank"
	| "rankLost"
	| "userSupportAgain"
	| "userSupportFirst"
	| "userSupportGift"
	| "usernameChange";

export type OEventBeatmapApproval =
	| "ranked"
	| "approved"
	| "qualified"
	| "loved";
