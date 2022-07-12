import { BeatmapDecoder } from "osu-parsers";
import { ManiaRuleset } from "osu-mania-stable";
import { Calculator, ComputatedPerformance } from "../../models/calculator";
import { OScore } from "../../models/osu-api/score";

export class ManiaCalculator implements Calculator {
	calculate(osuFile: string, score: OScore): ComputatedPerformance {
		const parsed = new BeatmapDecoder().decodeFromString(osuFile);

		const ruleset = new ManiaRuleset();

		const difficultyAttributes = ruleset.createDifficultyCalculator(parsed);

		const _mods = ruleset.createModCombination(score.mods_int);
		const mods = _mods.acronyms;

		const difficulty = difficultyAttributes.calculateWithMods(_mods);

		let _score = score.score;
		_score *= Math.pow(
			0.5,
			Number(mods.includes("EZ")) +
				Number(mods.includes("NF")) +
				Number(mods.includes("HT"))
		);
		const nerfPP =
			(mods.includes("EZ") ? 0.5 : 1) * (mods.includes("NF") ? 0.9 : 1);
		
		const strainBase =
			(Math.pow(5 * Math.max(1, difficulty.starRating / 0.2) - 4, 2.2) /
				135) *
			(1 + 0.1 * Math.min(1, parsed.hitObjects.length / 1500));

		const strainMultiplier =
			_score < 500000
				? (_score / 500000) * 0.1
				: _score < 600000
				? ((_score - 500000) / 100000) * 0.3
				: _score < 700000
				? ((_score - 600000) / 100000) * 0.25 + 0.3
				: _score < 800000
				? ((_score - 700000) / 100000) * 0.2 + 0.55
				: _score < 900000
				? ((_score - 800000) / 100000) * 0.15 + 0.75
				: ((_score - 900000) / 100000) * 0.1 + 0.9;

		const accValue =
			_score >= 960000
				? parsed.difficulty.overallDifficulty *
				0.02 *
				strainBase *
				Math.pow((_score - 960000) / 40000, 1.1)
				: 0;

		return {
			recentPP: Math.round(
				0.73 *
					Math.pow(
						Math.pow(accValue, 1.1) +
							Math.pow(strainBase * strainMultiplier, 1.1),
						1 / 1.1
					) *
					1.1 *
					nerfPP
			),
			fcPP: Math.round(
				0.73 *
					Math.pow(
						Math.pow(accValue, 1.1) +
							Math.pow(strainBase * strainMultiplier, 1.1),
						1 / 1.1
					) *
					1.1 *
					nerfPP
			),
			starRating: difficulty.starRating,
			maxCombo: difficulty.maxCombo,
			hitsInfo: this.getHitsFor(score),
		};
	}

	getHitsFor(score: OScore): string {
		return `${score.statistics.count_300}/${score.statistics.count_geki}/${score.statistics.count_100}/${score.statistics.count_katu}/${score.statistics.count_50}/${score.statistics.count_miss}`;
	}
}
