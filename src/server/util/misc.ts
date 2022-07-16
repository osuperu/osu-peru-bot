import moment from "moment";
import { OGamemodeName } from "../models/osu-api/gamemode";
import { OScore } from "../models/osu-api/score";
import { Timestamp } from "../models/osu-api/timestamp";

export class Misc {
	static secondsToHours(duration: number): number {
		return Math.trunc(duration / 3600);
	}

	static isNumeric(val: string): boolean {
		return val != null && val !== "" && !isNaN(Number(val.toString()));
	}

	static convertDaysToYearDays(days: number): string {
		const years = Math.floor(days / 365);
		const remainingDays = Math.round(days % 365);

		if (years > 0) {
			return `${years} ${
				years == 1 ? "año" : "años"
			}, ${remainingDays} dias`;
		} else {
			return `${remainingDays} dias`;
		}
	}

	static timeFromNow(date: Timestamp): string {
		return moment(date).fromNow(); // Por mejorar para que la fecha de manera mas exacta
	}

	static getHitsFor(gamemode: OGamemodeName, score: OScore): string {
		switch (gamemode) {
			case "osu": {
				return `${
					score.statistics.count_300 + score.statistics.count_geki
				}/${score.statistics.count_100 + score.statistics.count_katu}/${
					score.statistics.count_50
				}/${score.statistics.count_miss}`;
			}
			case "taiko": {
				return `${
					score.statistics.count_300 + score.statistics.count_geki
				}/${score.statistics.count_100 + score.statistics.count_katu}/${
					score.statistics.count_miss
				}`;
			}
			case "fruits": {
				return `${
					score.statistics.count_300 + score.statistics.count_geki
				}/${score.statistics.count_100 + score.statistics.count_katu}/${
					score.statistics.count_50
				}/${score.statistics.count_miss}`;
			}
			case "mania": {
				return `${score.statistics.count_300}/${score.statistics.count_geki}/${score.statistics.count_100}/${score.statistics.count_katu}/${score.statistics.count_50}/${score.statistics.count_miss}`;
			}
		}
	}
}
