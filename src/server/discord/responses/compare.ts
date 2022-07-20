import { MessageEmbed, MessageOptions } from "discord.js";
import { CommandResponse } from "../../models/command-response";
import { OUser } from "../../models/osu-api/user";
import { OBeatmap } from "../../models/osu-api/beatmap";
import { OScores } from "../../models/osu-api/score";
import { OGamemodeName } from "../../models/osu-api/gamemode";
import { Misc } from "../../util/misc";

export class CompareResponse implements CommandResponse {
	async getMessage(
		user: OUser,
		beatmap: OBeatmap,
		scores: OScores,
		gamemode: OGamemodeName
	): Promise<MessageOptions> {
		let count = 1;

		if (scores.scores.length === 0) {
			return {
				content: `${user.username} no tiene puntuciones en el mapa.`,
			};
		}

		const embed = new MessageEmbed()
			.setAuthor({
				name: `${user.username}: ${user.statistics.pp}pp (#${
					user.statistics.global_rank || 0
				} | ${user.country_code.toUpperCase}: #${
					user.statistics.rank.country
				})`,
				url: `https://osu.ppy.sh/users/${user.id}`,
				iconURL: user.avatar_url,
			})
			.setTitle(
				`${beatmap.beatmapset.artist} - ${beatmap.beatmapset.title} [${beatmap.version}]`
			)
			.setURL(`https://osu.ppy.sh/b/${beatmap.id}`)
			.setThumbnail(
				`https://b.ppy.sh/thumb/${beatmap.beatmapset.id}l.jpg`
			)
			.setDescription(
				`Descargas: [Bancho](https://osu.ppy.sh/d/${beatmap.id}) • [Beatconnect](https://beatconnect.io/b/${beatmap.id}) • [Chimu](https://api.chimu.moe/v1/download/${beatmap.id})`
			);

		for (const score of scores.scores) {
			const mods = score.mods.length > 0 ? ` ${score.mods.join("")}` : "";

			embed.addField(
				`**${count}. Mods:** ${mods}`,
				`•  ${score.rank} ▸ **${
					score.pp ? score.pp.toFixed(2) : 0
				}pp** ▸ ${(score.accuracy * 100).toFixed(2)}%` +
					"\n" +
					`Puntaje: ${Misc.toNumberWithCommas(
						score.score
					)} ▸ Combo: ${beatmap.max_combo}x/${
						beatmap.max_combo
					}x ▸ [${Misc.getHitsFor(gamemode, score)}]` +
					"\n" +
					`Puntuacion hecha <t:${Misc.convertToUnixTimestamp(
						score.created_at
					)}:R>`
			);

			count++;
		}

		return {
			embeds: [embed],
		};
	}
}
