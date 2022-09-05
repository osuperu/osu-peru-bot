import { MessageEmbed, TextChannel } from "discord.js";
import { App } from "../app";
import { OBeatmapset } from "../models/osu-api/beatmap";
import { OEventBeatmapsetUpload } from "../models/osu-api/event";
import { Script } from "../models/script";
import { UserMappingTrack } from "../models/user";
import { OsuApi } from "../util/api/osu-api";
import { Misc } from "../util/misc";

export default class MappingTracking implements Script {
	async run(): Promise<void> {
		await UserMappingTrack.find().then((users) =>
			users.forEach(async (user) => {
				const events = (await OsuApi.fetchRecentActivity(
					user.userID,
					10,
					0
				)) as OEventBeatmapsetUpload[];

				if (events.length > 0) {
					events.reverse(); // In the osu!api, the events come from the most recent to the oldest, so I reverse the array

					const channel =
						App.instance.discordClient.discordClient.channels.cache.find(
							(channel) =>
								channel.id ===
								App.instance.config.discord.tracking.mapping
						) as TextChannel;

					let _lastUpdated: Date;

					for (const event of events) {
						if (event.type === "beatmapsetUpload") {
							const _createdAt = new Date(event.created_at);

							if (_createdAt > user.lastUpdated) {
								const regexp = /(\d+)/g;
								const match = regexp.exec(event.beatmapset.url);

								if (match !== null) {
									const beatmapsetID = parseInt(match[1]);

									const beatmapset =
										(await OsuApi.fetchBeatmapset(
											beatmapsetID
										)) as OBeatmapset;

									beatmapset.beatmaps.sort(Misc.sortBeatmaps);

									let description = "";
									for (const beatmap of beatmapset.beatmaps) {
										if (beatmap.difficulty_rating < 0.01) {
											_lastUpdated = new Date(_createdAt.getTime() - 1000);
											break;
										}
										
										description +=
											`${Misc.getStarRatingEmoji(
												beatmap.difficulty_rating
											)} ${
												beatmap.version
											} - ${beatmap.difficulty_rating.toFixed(
												2
											)}★ [${beatmap.mode}]` + "\n";
									}

									const embed = new MessageEmbed()
										.setAuthor({
											name: `Nuevo mapa subido por ${event.user.username}`,
										})
										.setTitle(
											`${beatmapset.artist} - ${beatmapset.title}`
										)
										.setThumbnail(
											beatmapset.user.avatar_url
										);

									embed.setDescription(description);
									embed
										.addField(
											"\u200b",
											"**Cover del beatmap:**"
										)
										.setImage(
											`https://assets.ppy.sh/beatmaps/${beatmapset.id}/covers/cover.jpg`
										);

									channel.send({
										embeds: [embed],
									});

									_lastUpdated = _createdAt;
								}
							}
						}
					}

					if (_lastUpdated) {
						user.lastUpdated = _lastUpdated;
						await user.save();
					}
				}
			})
		);
	}
}
