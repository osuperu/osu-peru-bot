import { MessageOptions } from "discord.js";
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
		let description = "";
		let count = 1;

		if (scores.scores.length === 0) {
			return {
				content: `${user.username} no tiene puntuciones en el mapa.`,
			};
		}
		for (const score of scores.scores) {
			const mods = score.mods.length > 0 ? ` ${score.mods.join("")}` : "";

			description +=
				`**${count}.** ${mods}` +
				"\n" +
				`${score.rank} • ${
					score.pp ? score.pp.toFixed(0) : undefined
				}pp › ${(score.accuracy * 100).toFixed(2)}% › <${
					score.max_combo
				}x/${beatmap.max_combo}x> › \`[${Misc.getHitsFor(
					gamemode,
					score
				)}]\`` +
				"\n" +
				`Hace ${Misc.timeFromNow(score.created_at)}` +
				"\n";

			count++;
		}

		return {
			embeds: [
				{
					author: {
						icon_url: user.avatar_url,
						name: `Top de jugadas de ${user.username} en ${beatmap.beatmapset.artist} - ${beatmap.beatmapset.title} [${beatmap.version}]| osu!${gamemode}`,
					},
					url: `https://osu.ppy.sh/b/${beatmap.id}`,
					description: description,
					thumbnail: {
						url: `https://b.ppy.sh/thumb/${beatmap.beatmapset.id}l.jpg`,
					},
				},
			],
		};
	}
}
