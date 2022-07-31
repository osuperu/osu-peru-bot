import moment from "moment";
import { App } from "../app";
import { OGamemodeName } from "../models/osu-api/gamemode";
import { OScore } from "../models/osu-api/score";
import { Timestamp } from "../models/osu-api/timestamp";
import { OBeatmap } from "../models/osu-api/beatmap";

export class Misc {
	static secondsToHours(duration: number): number {
		return Math.trunc(duration / 3600);
	}

	static isNumeric(val: string): boolean {
		return val != null && val !== "" && !isNaN(Number(val.toString()));
	}

	static toNumberWithCommas(_number: number): string {
		return _number
			.toString()
			.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
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

	static convertToUnixTimestamp(date: Timestamp): number {
		return moment(date).unix();
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

	static getEmojiID(name: string): string {
		const emojis: unknown = {
			osu: App.instance.config.discord.emojis.gamemodes.osu,
			taiko: App.instance.config.discord.emojis.gamemodes.taiko,
			fruits: App.instance.config.discord.emojis.gamemodes.fruits,
			mania: App.instance.config.discord.emojis.gamemodes.mania,
		};

		const request = emojis[name];

		return !request ? "" : request;
	}

	static getStarRatingEmoji(starRating: number): string {
		if (starRating >= 0 && starRating <= 1.99) {
			return `<:${App.instance.config.discord.emojis.difficulties.easy.name}:${App.instance.config.discord.emojis.difficulties.easy.id}>`;
		} else if (starRating >= 2 && starRating <= 2.69) {
			return `<:${App.instance.config.discord.emojis.difficulties.normal.name}:${App.instance.config.discord.emojis.difficulties.normal.id}>`;
		} else if (starRating >= 2.7 && starRating <= 3.99) {
			return `<:${App.instance.config.discord.emojis.difficulties.hard.name}:${App.instance.config.discord.emojis.difficulties.hard.id}>`;
		} else if (starRating >= 4.0 && starRating <= 5.29) {
			return `<:${App.instance.config.discord.emojis.difficulties.insane.name}:${App.instance.config.discord.emojis.difficulties.insane.id}>`;
		} else if (starRating >= 5.3 && starRating <= 6.49) {
			return `<:${App.instance.config.discord.emojis.difficulties.expert.name}:${App.instance.config.discord.emojis.difficulties.expert.id}>`;
		} else if (starRating >= 6.5) {
			return `<:${App.instance.config.discord.emojis.difficulties.expertPlus.name}:${App.instance.config.discord.emojis.difficulties.expertPlus.id}>`;
		}
	}

	static sortBeatmaps(a: OBeatmap, b: OBeatmap): number {
		if (a.difficulty_rating < b.difficulty_rating) {
			return -1;
		}
		if (a.difficulty_rating > b.difficulty_rating) {
			return 1;
		}
		return 0;
	}
}
