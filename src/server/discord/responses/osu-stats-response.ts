import { MessageOptions } from "discord.js";
import { CommandResponse } from "../../models/command-response";
import { OUser } from "../../models/osu-api/user";
import { Misc } from "../../util/misc";
import { OGamemodeName } from "../../models/osu-api/gamemode";

export class OsuStatsResponse implements CommandResponse {
	getMessage(user: OUser, gamemode: OGamemodeName): MessageOptions {
		return {
			embeds: [
				{
					author: {
						name: user.username,
						url: "https://osu.ppy.sh/users/" + user.id,
						icon_url: `https://osu.ppy.sh/images/flags/${user.country.code}.png`,
					},
					thumbnail: {
						url: user.avatar_url,
					},
					description:
						`▸ **Rank:** #${user.statistics.global_rank || 0} (${user.country.name} #${user.statistics.rank.country || 0})` + "\n" +
						`▸ **Nivel:** ${user.statistics.level.current} (${user.statistics.level.progress}%)` + "\n" +
						`▸ **Total PP:** ${user.statistics.pp}` + "\n" +
						`▸ **Precision:** ${user.statistics.hit_accuracy.toFixed(2)}` + "\n" +
						`▸ **Conteo de jugadas:** ${user.statistics.play_count} (${Misc.secondsToHours(user.statistics.play_time)} hrs)` + "\n",
					footer: {
						text: `Anteriores nombres de usuario: ${
							user.previous_usernames.join(", ") ||
							"El usuario no ha tenido otros nombres de usuario"
						}`,
						/*
                        icon_url: `https://raw.githubusercontent.com/ppy/osu-wiki/master/wiki/shared/mode/${
                            gamemode === "fruits" ? "catch" : gamemode
                        }.png`,*/
					},
				},
			],
		};
	}
}
