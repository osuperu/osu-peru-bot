import { OScore } from "./osu-api/score";

export interface Calculator {
	calculate(osuFilePath: string, score: OScore): ComputatedPerformance;
}

export interface ComputatedPerformance {
	recentPP: number;
	fcPP: number;
	starRating: number; // Temporal
	maxCombo: number; // Temporal
	hitsInfo: string;
}
