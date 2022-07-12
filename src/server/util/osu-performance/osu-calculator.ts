import { BeatmapDecoder } from "osu-parsers";
import { ScoreInfo, BeatmapInfo } from "osu-classes";
import { StandardRuleset } from "osu-standard-stable";
import { Calculator, ComputatedPerformance } from "../../models/calculator";
import { OScore } from "../../models/osu-api/score";

export class OsuCalculator implements Calculator {
	public calculate(osuFile: string, score: OScore): ComputatedPerformance {
		const decoder = new BeatmapDecoder();
		const parsed = decoder.decodeFromString(osuFile);
		const ruleset = new StandardRuleset();

		const _mods = ruleset.createModCombination(score.mods_int);
		const osuBeatmap = ruleset.applyToBeatmapWithMods(parsed, _mods);
		const map = ruleset.createDifficultyCalculator(osuBeatmap);

		const beatmapDifficulty = map.calculateWithMods(_mods);

		const _score = new ScoreInfo();
		const mapInfo = new BeatmapInfo(osuBeatmap);

		_score.beatmap = mapInfo;
		_score.maxCombo = score.max_combo;
		_score.count300 =
			score.statistics.count_300 + score.statistics.count_geki;
		_score.count100 =
			score.statistics.count_100 + score.statistics.count_katu;
		_score.count50 = score.statistics.count_50;
		_score.statistics.miss = score.statistics.count_miss;
		_score.accuracy = score.accuracy;

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
			hitsInfo: this.getHitsFor(score),
		};
	}

	public getHitsFor(score: OScore): string {
		return `${score.statistics.count_300 + score.statistics.count_geki}/${
			score.statistics.count_100 + score.statistics.count_katu
		}/${score.statistics.count_50}/${score.statistics.count_miss}`;
	}
}
