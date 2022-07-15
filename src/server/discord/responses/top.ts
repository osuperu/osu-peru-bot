import { MessageOptions } from "discord.js";
import { CommandResponse } from "../../models/command-response";
import { OUser } from "../../models/osu-api/user";
import { OScore } from "../../models/osu-api/score";
import { OGamemodeName } from "../../models/osu-api/gamemode";
import { Misc } from "../../util/misc";
import { OsuApi } from "../../util/api/osu-api";
import { OBeatmapsCompact } from "../../models/osu-api/beatmap";

export class TopResponse implements CommandResponse {
	async getMessage(
		user: OUser,
		scores: OScore[],
		gamemode: OGamemodeName
	): Promise<MessageOptions> {
		let description = "";
		let count = 1;

		const beatmapIDs = scores.map(s => s.beatmap.id) as number[];
		const beatmaps = await OsuApi.fetchBeatmaps(...beatmapIDs) as OBeatmapsCompact;

		for (const score of scores) {
			const mods = score.mods.length > 0 ? ` ${score.mods.join("")}` : "";
			const beatmap = beatmaps.beatmaps.find(element => element.id === score.beatmap.id);

			description +=
				`**${count}.** [${score.beatmapset.title} - [${score.beatmap.version}]](${score.beatmap.url}) **+${mods}**` +
				"\n";
			description +=
				`${score.rank} • ${
					score.pp ? score.pp.toFixed(0) : undefined
				}pp › ${(score.accuracy * 100).toFixed(2)}% › <${
					score.max_combo
				}x/${beatmap.max_combo}x> › \`[${Misc.getHitsFor(
					gamemode,
					score
				)}]\`` + "\n";

			count++;
		}

		return {
			embeds: [
				{
					author: {
						icon_url: `https://osu.ppy.sh/images/flags/${user.country.code}.png`,
						name: `Top 5 de jugadas de ${user.username}`,
					},
					url: `https://osu.ppy.sh/users/${user.id}`,
					description: description,
					thumbnail: {
						url: user.avatar_url,
					},
				},
			],
		};
	}
}
