import axios from "axios";
import { MessageOptions } from "discord.js";
import { CommandResponse } from "../../models/command-response";
import { OUser } from "../../models/osu-api/user";
import { OScore } from "../../models/osu-api/score";
import { OGamemodeName } from "../../models/osu-api/gamemode";
import { PerformanceFactory } from "../../util/performance-factory";

export class RecentResponse implements CommandResponse {
	async getMessage(
		user: OUser,
		score: OScore,
		gamemode: OGamemodeName
	): Promise<MessageOptions> {
		const beatmapFile = await axios(
			`https://osu.ppy.sh/osu/${score.beatmap.id}`
		);
		const computedPerformance = new PerformanceFactory()
			.getCalculator(gamemode)
			.calculate(beatmapFile.data, score);
		const mods = score.mods.length > 0 ? ` +${score.mods.join("")}` : "";

		return {
			embeds: [
				{
					author: {
						icon_url: score.user.avatar_url,
						name: `Score reciente de osu!${
							score.mode != "osu" ? score.mode : ""
						} jugado por ${score.user.username}`,
					},
					url: `https://osu.ppy.sh/b/${score.beatmap.id}`,
					title: `${score.beatmapset.artist} - ${
						score.beatmapset.title
					} [${
						score.beatmap.version
					}] (${computedPerformance.starRating.toFixed(2)}★${mods})`,
					description: `${score.rank} • ${
						(score.pp ? score.pp.toFixed(0) : undefined) ||
						Math.round(computedPerformance.recentPP)
					}pp › ${(score.accuracy * 100).toFixed(2)}% › <${
						score.max_combo
					}x/${computedPerformance.maxCombo}x> › \`[${
						computedPerformance.hitsInfo
					}]\``,
					thumbnail: {
						url: `https://b.ppy.sh/thumb/${score.beatmapset.id}l.jpg`,
					},
					color: "#f45592",
					timestamp: new Date(score.created_at),
				},
			],
		};
	}
}
