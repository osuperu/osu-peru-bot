import { Timestamp } from "../osu-api/timestamp";
import { OGamemodeName } from "../osu-api/gamemode";

export interface QatUser {
	groups: string[];
	isVetoMediator: boolean;
	isBnEvaluator: boolean;
	inBag: boolean;
	isTrialNat: boolean;
	bnProfileBadge: number;
	natProfileBadge: number;
	rankedBeatmapsets: number;
	requestStatus: string[];
	genrePreferences: string[];
	genreNegativePreferences: string[];
	languagePreferences: string[];
	languageNegativePreferences: string[];
	osuStylePreferences: string[];
	osuStyleNegativePreferences: string[];
	taikoStylePreferences: string[];
	taikoStyleNegativePreferences: string[];
	catchStylePreferences: string[];
	catchStyleNegativePreferences: string[];
	maniaStylePreferences: string[];
	maniaStyleNegativePreferences: string[];
	maniaKeymodePreferences: string[];
	maniaKeymodeNegativePreferences: string[];
	detailPreferences: string[];
	detailNegativePreferences: string[];
	mapperPreferences: string[];
	mapperNegativePreferences: string[];
	isBnFinderAnonymous: boolean;
	_id: string;
	osuId: number;
	username: string;
	createdAt: Timestamp;
	updatedAt: Timestamp;
	__v: number;
	modesInfo: QatUserModesInfo[];
	history: QatUserHistory[];
	isFeatureTester: boolean;
	requestLink: string;
	stylePreferences: string[];
	isNat: boolean;
	isBn: boolean;
	isBnOrNat: boolean;
	hasBasicAccess: boolean;
	hasFullReadAccess: boolean;
	isNatOrTrialNat: boolean;
	modes: string[];
	fullModes: string[];
	probationModes: string[];
	bnDuration: number;
	natDuration: number;
	id: string;
}

export interface QatUserModesInfo {
	mode: string;
	level: string;
}

export interface QatUserHistory {
	group: string;
	date: Timestamp;
	mode: string;
	kind: string;
	relatedEvaluation?: string | null;
}

export interface UserActivity {
	uniqueNominations: Nomination[];
	nominationsDisqualified: NominationReset[];
	nominationsPopped: NominationReset[];
	disqualifications: NominationReset[];
	pops: NominationReset[];
	qualityAssuranceChecks: QACheck[];
	disqualifiedQualityAssuranceChecks: DisqualifiedQACheck[];
}

export interface Nomination {
	_id: string;
	type: EventType;
	timestamp: Timestamp;
	beatmapsetId: number;
	creatorId: number;
	creatorName: string;
	modes: OGamemodeName[];
	discussionId: number | null;
	userId: number;
	artistTitle: string;
	content: string | null;
	genre: string;
	language: string;
}

export interface NominationReset {
	_id: string;
	type: EventType;
	timestamp: Timestamp;
	beatmapsetId: number;
	creatorId: number;
	creatorName: string;
	modes: OGamemodeName[];
	discussionId: number | null;
	userId: number;
	content: string | null;
	genre: string;
	language: string;
	__v?: number;
	createdAt?: Timestamp;
	isBnOrNat?: boolean;
	isReviewed?: boolean;
	isUnique?: boolean;
	responsibleNominators?: [];
	updatedAt?: Timestamp;
	obviousness?: number | null;
	severity?: number | null;
}

export interface QACheck {
	_id: string;
	user: string;
	event: BeatmapEvent;
	timestamp: Timestamp;
	mode: string;
	createdAt: Timestamp;
	updatedAt: Timestamp;
	__v: number;
	comment?: string;
	id: string;
}

export interface BeatmapEvent {
	modes: OGamemodeName[];
	_id: string;
	timestamp: Timestamp;
	beatmapsetId: number;
	creatorId: number;
	creatorName: string;
	artistTitle: string;
	id: string;
}

export interface DisqualifiedQACheck {
	modes: OGamemodeName[];
	obviousness: number | null;
	severity: number | null;
	isBnOrNat: boolean;
	isUnique: boolean;
	responsibleNominators: [];
	isReviewed: boolean;
	_id: string;
	type: EventType;
	timestamp: Timestamp;
	beatmapsetId: number;
	creatorId: number;
	creatorName: string;
	discussionId: number | null;
	userId: number | null;
	artistTitle: string;
	content: string | null;
	genre: string;
	language: string;
	__v: number;
	createdAt: Timestamp;
	updatedAt: Timestamp;
	qaComment?: string | null;
	id: string;
}

export type EventType =
	| "nominate"
	| "qualify"
	| "disqualify"
	| "nomination_reset";
