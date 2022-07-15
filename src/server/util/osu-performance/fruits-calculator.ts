import { BeatmapDecoder } from "osu-parsers";
import { ScoreInfo, BeatmapInfo } from "osu-classes";
import { CatchRuleset } from "osu-catch-stable";
import { Calculator, ComputatedPerformance } from "../../models/calculator";
import { OScore } from "../../models/osu-api/score";
import { Misc } from "../misc";

export class FruitsCalculator implements Calculator {
	public calculate(osuFile: string, score: OScore): ComputatedPerformance {
		const decoder = new BeatmapDecoder();
		const parsed = decoder.decodeFromString(osuFile);
		const ruleset = new CatchRuleset();

		const _mods = ruleset.createModCombination(score.mods_int);
		const ctbBeatmap = ruleset.applyToBeatmapWithMods(parsed, _mods);
		const map = ruleset.createDifficultyCalculator(ctbBeatmap);

		const beatmapDifficulty = map.calculate();

		const _score = new ScoreInfo();
		const mapInfo = new BeatmapInfo(ctbBeatmap);

		_score.beatmap = mapInfo;
		_score.statistics.great = score.statistics.count_300;
		_score.statistics.largeTickHit = score.statistics.count_100;
		_score.statistics.smallTickHit = score.statistics.count_50;
		_score.statistics.smallTickMiss = score.statistics.count_katu;
		_score.statistics.miss = score.statistics.count_miss;

		const performanceCalculator = ruleset.createPerformanceCalculator(
			beatmapDifficulty,
			_score
		);

		const recentPP = performanceCalculator.calculate();
		_score.statistics.ignoreMiss = score.statistics.count_miss;
		const fcPP = performanceCalculator.calculate();

		return {
			recentPP: recentPP,
			fcPP: fcPP,
			starRating: beatmapDifficulty.starRating,
			maxCombo: beatmapDifficulty.maxCombo,
			hitsInfo: Misc.getHitsFor("fruits", score),
		};
	}
}
