import { MessageEmbed, MessageOptions } from "discord.js";
import { CommandResponse } from "../../models/command-response";
import { QatUser, UserActivity } from "../../models/qat-api/qat";
import { OUser } from "../../models/osu-api/user";
import { Misc } from "../../util/misc";

export class BNStatsResponse implements CommandResponse {
	async getMessage(
		osuUser: OUser,
		qatUser: QatUser,
		userActivity: UserActivity
	): Promise<MessageOptions> {
		const latestNom =
			userActivity.uniqueNominations[
				userActivity.uniqueNominations.length - 1
			];
		let reqStatus = "";

		if (qatUser.requestStatus.length > 0) {
			if (qatUser.requestStatus.includes("closes")) {
				reqStatus = "Cerrado";
			} else {
				reqStatus = `Abierto (${this.getRequestStatus(qatUser)})`;
			}
		} else {
			reqStatus = "Desconocido";
		}

		const embed = new MessageEmbed()
			.setAuthor({
				name: `${osuUser.username} • BN/NAT info`,
				url: `https://osu.ppy.sh/users/${osuUser.id}`,
			})
			.setThumbnail(`https://a.ppy.sh/${osuUser.id}`)
			.setDescription(
				`Mostrando información de **[${osuUser.username}'s desde la web BN Mappers Guild](https://bn.mappersguild.com/users?id=${qatUser.id})** de los ultimos **90** dias.`
			)
			.addField("Estado de BN", `${reqStatus}`, true)
			.addField(
				"BN por",
				`${Misc.convertDaysToYearDays(qatUser.bnDuration)}`,
				true
			);

		if (qatUser.natDuration) {
			embed.addField(
				"NAT por",
				`${Misc.convertDaysToYearDays(qatUser.natDuration)}`,
				true
			);
		} else {
			embed.addField("\u200b", "\u200b", true);
		}

		embed.addFields(
			{
				name: "Nominaciones",
				value: userActivity.uniqueNominations.length.toString(),
				inline: true,
			},
			{
				name: "Mappers",
				value: `${this.getUniqueMappersNumber(
					userActivity
				).toString()} (${Math.floor(
					(this.getUniqueMappersNumber(userActivity) /
						userActivity.uniqueNominations.length) *
						100
				)}%)`,
				inline: true,
			},
			{
				name: "\u200b",
				value: "\u200b",
				inline: true,
			},
			{
				name: "Reseteos recibidos",
				value: `${
					userActivity.nominationsDisqualified.length +
					userActivity.nominationsPopped.length
				}`,
				inline: true,
			},
			{
				name: "Reseteos dados",
				value: `${userActivity.disqualifications.length}`,
				inline: true,
			},
			{
				name: "\u200b",
				value: "\u200b",
				inline: true,
			},
			{
				name: "Chequeos de QA",
				value: `${userActivity.qualityAssuranceChecks.length}`,
				inline: true,
			},
			{
				name: "Chequeos de descalificaciones QA",
				value: `${userActivity.disqualifiedQualityAssuranceChecks.length}`,
				inline: true,
			},
			{
				name: "\u200b",
				value: "\u200b",
				inline: true,
			},
			{
				name: "Top de Mappers",
				value: `${this.getTop3Mappers(userActivity).toString()}`,
				inline: true,
			},
			{
				name: "Top de Generos",
				value: `${this.getTop3Genres(userActivity).toString()}`,
				inline: true,
			},
			{
				name: "Top de Idiomas",
				value: `${this.getTop3Languages(userActivity).toString()}`,
				inline: true,
			}
		);

		if (latestNom) {
			let nomMessage = latestNom.content
				? latestNom.content.replace(/\r?\n|\r/g, " ")
				: "";

			if (nomMessage.length > 60) {
				nomMessage = nomMessage.substring(0, 57) + "...";
			}

			embed
				.addField(
					"Ultima nominacion",
					`[${latestNom.artistTitle}](https://osu.ppy.sh/beatmapsets/${latestNom.beatmapsetId})`,
					true
				)
				.setImage(
					`https://assets.ppy.sh/beatmaps/${latestNom.beatmapsetId}/covers/cover.jpg`
				);

			if (latestNom.content) {
				embed.setFooter({
					text: `${osuUser.username} "${nomMessage}"`,
					iconURL: `https://a.ppy.sh/${osuUser.id}`,
				});
			}
		}

		return {
			embeds: [embed],
		};
	}

	private getRequestStatus(user: QatUser): string {
		let requestStatus = user.requestStatus;

		requestStatus = requestStatus.filter((status) => status !== "closed");

		return requestStatus
			.join(", ")
			.replace(
				"personalQueue",
				`${
					user.requestLink
						? `[cola personal](${user.requestLink})`
						: `cola personal (sin link)`
				}`
			)
			.replace(
				"globalQueue",
				"[cola global](https://bn.mappersguild.com/modrequests/listing)"
			)
			.replace("gameChat", "chat del juego");
	}

	private getUniqueMappersNumber(activity: UserActivity): number {
		return new Set(
			activity.uniqueNominations.map((nomination) => nomination.creatorId)
		).size;
	}

	private getTop3Mappers(activity: UserActivity): string {
		if (activity.uniqueNominations.length === 0) {
			return "-";
		}
		const mappers = this.getMappers(activity);
		const mapperFrequency = mappers.reduce((acc, cur) => {
			acc[cur] = (acc[cur] || 0) + 1;
			return acc;
		}, {} as { [key: string]: number });

		const sortedMapperFrequency = Object.entries(mapperFrequency)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 3);

		let res = "";
		for (const [key, value] of sortedMapperFrequency) {
			res += `${key} (${value}) \n`;
		}

		return res;
	}

	private getTop3Genres(activity: UserActivity): string {
		if (activity.uniqueNominations.length === 0) {
			return "-";
		}
		const genres = this.getGenres(activity);
		const genreFrequency = genres.reduce((acc, cur) => {
			acc[cur] = (acc[cur] || 0) + 1;
			return acc;
		}, {} as { [key: string]: number });

		const sortedGenreFrequency = Object.entries(genreFrequency)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 3);

		let res = "";
		for (const [key, value] of sortedGenreFrequency) {
			res += `${key} (${value}) \n`;
		}

		return res;
	}

	private getTop3Languages(activity: UserActivity): string {
		if (activity.uniqueNominations.length === 0) {
			return "-";
		}
		const languages = this.getLanguages(activity);
		const languageFrequency = languages.reduce((acc, cur) => {
			acc[cur] = (acc[cur] || 0) + 1;
			return acc;
		}, {} as { [key: string]: number });

		const sortedlanguageFrequency = Object.entries(languageFrequency)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 3);

		let res = "";
		for (const [key, value] of sortedlanguageFrequency) {
			res += `${key} (${value}) \n`;
		}

		return res;
	}

	private getMappers(activity: UserActivity): string[] {
		const mappers = [];
		for (const nomination of activity.uniqueNominations) {
			mappers.push(nomination.creatorName);
		}
		return mappers;
	}

	private getGenres(activity: UserActivity): string[] {
		const genres = [];
		for (const nomination of activity.uniqueNominations) {
			genres.push(nomination.genre);
		}
		return genres;
	}

	private getLanguages(activity: UserActivity): string[] {
		const languages = [];
		for (const nomination of activity.uniqueNominations) {
			languages.push(nomination.language);
		}
		return languages;
	}
}
