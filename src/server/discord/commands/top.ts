import { SlashCommand, SlashCommandReturn } from "../models/slash-command";
import { User } from "../../models/user";
import { OUser } from "../../models/osu-api/user";
import { OScore } from "../../models/osu-api/score";
import { TopResponse } from "../responses/top";
import { OsuApi } from "../../util/api/osu-api";
import { OGamemodeName } from "../../models/osu-api/gamemode";
import { ErrorResponse } from "../responses/error";

export default <SlashCommand>{
	commandEnum: "TOP",
	name: "top",
	description: "Muestra las 5 mejores jugadas de un jugador.",
	options: [
		{
			name: "user",
			description:
				"Nombre de usuario o ID del jugador cuyas estadísticas quieres ver",
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
				"Modo de juego de juego vinculado al jugador cuyas estadisticas quieres ver",
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
		{
			name: "offset",
			description:
				"Especifique el numero de la jugada reciente a mostrar.",
			type: "INTEGER",
			required: false,
		},
	],
	async call({ interaction, logger }): Promise<SlashCommandReturn> {
		try {
			const guildMember =
				interaction.options.getUser("discord", false) ||
				interaction.member.user;

			const userDb = await User.findOne({
				"discord.userID": guildMember.id,
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
			const offset = interaction.options.getInteger("offset", false) || 0;

			const osuUser = (await OsuApi.fetchUserPublic(
				user,
				gamemode
			)) as OUser;

			const ret = (await OsuApi.fetchUserTopPlays(
				osuUser.id,
				gamemode,
				5, // Return 5 plays
				offset
			)) as OScore[];

			return {
				message: await new TopResponse().getMessage(
					osuUser,
					ret,
					gamemode,
					offset
				),
			};
		} catch (e) {
			return {
				message: await new ErrorResponse().getMessage(e, logger),
			};
		}
	},
};
