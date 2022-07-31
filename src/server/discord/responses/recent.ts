import axios from "axios";
import { MessageEmbed, MessageOptions } from "discord.js";
import { CommandResponse } from "../../models/command-response";
import { OUser } from "../../models/osu-api/user";
import { OScore } from "../../models/osu-api/score";
import { OGamemodeName } from "../../models/osu-api/gamemode";
import { PerformanceFactory } from "../../util/performance-factory";
import { Misc } from "../../util/misc";

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

		const embed = new MessageEmbed()
			.setAuthor({
				name: `${user.username}: ${user.statistics.pp}pp (#${
					user.statistics.global_rank || 0
				} | ${user.country_code.toUpperCase()}: #${
					user.statistics.rank.country
				})`,
				url: `https://osu.ppy.sh/users/${user.id}`,
				iconURL: user.avatar_url,
			})
			.setTitle(
				`${score.beatmapset.artist} - ${score.beatmapset.title} [${
					score.beatmap.version
				}] +${mods} [${computedPerformance.starRating.toFixed(2)}★]`
			)
			.setURL(`https://osu.ppy.sh/b/${score.beatmap.id}`)
			.setThumbnail(`https://b.ppy.sh/thumb/${score.beatmapset.id}l.jpg`)
			.setDescription(
				`Descargas: [Bancho](https://osu.ppy.sh/d/${score.beatmap.id}) • [Beatconnect](https://beatconnect.io/b/${score.beatmap.id}) • [Chimu](https://api.chimu.moe/v1/download/${score.beatmap.id})` +
					"\n\n" +
					`•  ${score.rank} ▸ ${
						(score.pp ? score.pp.toFixed(2) : 0) ||
						computedPerformance.recentPP.toFixed(2)
					}pp ▸ ${(
						score.accuracy * 100
					).toFixed(2)}%` +
					"\n" +
					`Puntaje: ${Misc.toNumberWithCommas(
						score.score
					)} ▸ Combo: ${score.max_combo}x/${
						computedPerformance.maxCombo
					}x ▸ [${Misc.getHitsFor(gamemode, score)}]` +
					"\n\n" +
					`Puntuacion hecha <t:${Misc.convertToUnixTimestamp(
						score.created_at
					)}:R>`
			);

		return {
			embeds: [embed],
		};
	}
}
