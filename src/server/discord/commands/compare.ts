import { SlashCommand, SlashCommandReturn } from "../models/slash-command";
import { User } from "../../models/user";
import { OGamemodeName } from "../../models/osu-api/gamemode";
import { OUser } from "../../models/osu-api/user";
import { OScores } from "../../models/osu-api/score";
import { OBeatmap } from "../../models/osu-api/beatmap";
import { OsuApi } from "../../util/api/osu-api";
import { CompareResponse } from "../responses/compare";
import { ErrorResponse } from "../responses/error";

export default <SlashCommand>{
	commandEnum: "COMPARE",
	name: "compare",
	description: "Compara tu puntuacion con la ultima enviada en el canal.",
	options: [
		{
			name: "user",
			description:
				"Nombre de usuario o ID del jugador cuya jugada reciente quieres ver",
			type: "STRING",
			required: false,
		},
		{
			name: "discord",
			description:
				"Especifica un usuario de discord verificado en el servidor",
			type: "USER",
			required: false,
		},
		{
			name: "gamemode",
			description:
				"Modo de juego de juego de la jugada a comparar. Por defecto se buscan jugadas de osu!standard",
			type: "STRING",
			choices: [
				{
					name: "osu!standard",
					value: "osu",
				},
				{
					name: "osu!taiko",
					value: "taiko",
				},
				{
					name: "osu!catch",
					value: "fruits",
				},
				{
					name: "osu!mania",
					value: "mania",
				},
			],
			required: false,
		},
	],
	async call({ interaction, logger }): Promise<SlashCommandReturn> {
		try {
			const guildMember =
				interaction.options.getUser("discord", false) ||
				interaction.member.user;
			const userDb = await User.findOne({
				"discord.userId": guildMember.id,
			});

			if (!userDb) {
				return {
					message: {
						content:
							"El usuario no tiene ninguna cuenta de osu! vinculada.",
					},
				};
			}

			const user =
				interaction.options.getString("user", false) ||
				(userDb ? userDb.osu.userID.toString() : null);
			const gamemode = (interaction.options.getString(
				"gamemode",
				false
			) || "osu") as OGamemodeName;

			const messages = await interaction.channel.messages
				.fetch({ limit: 100 })
				.then((messageMappings) => {
					return Array.from(messageMappings.values());
				});

			const regexp = /\w+\.ppy\.sh\/(?:b\/|beatmapsets\/\d+#\w+\/)(\d+)/g;
			let beatmapID: number;
			for (const message of messages) {
				if (message.embeds.length > 0) {
					for (const embed of message.embeds) {
						const match = regexp.exec(embed.url);

						if (match !== null) {
							beatmapID = parseInt(match[1]);
							break;
						}
					}
				}

				const match = regexp.exec(message.content);

				if (match !== null) {
					beatmapID = parseInt(match[1]);
					break;
				}
			}

			const osuUser = (await OsuApi.fetchUserPublic(
				user,
				gamemode
			)) as OUser;

			const beatmap = (await OsuApi.fetchBeatmap(
				beatmapID
			)) as OBeatmap;

			const ret = (await OsuApi.fetchUserBeatmapScores(
				beatmapID,
				osuUser.id,
				gamemode
			)) as OScores;

			return {
				message: await new CompareResponse().getMessage(
					osuUser,
					beatmap,
					ret,
					gamemode
				),
			};
		} catch (e) {
			return {
				message: await new ErrorResponse().getMessage(e, logger),
			};
		}
	},
};
