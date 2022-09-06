import { OGamemodeName } from "../../models/osu-api/gamemode";
import { QatUser } from "../../models/qat-api/qat";
import { User } from "../../models/user";
import { QatApi } from "../../util/api/qat-api";
import { SlashCommand, SlashCommandReturn } from "../models/slash-command";
import { ErrorResponse } from "../responses/error";
import { OpenBNsResponse } from "../responses/open-bns";

export default <SlashCommand>{
	commandEnum: "OPENBNS",
	name: "open-bns",
	description: "Muestra una lista de los BNs/NATs actualmente disponibles.",
	options: [
		{
			name: "gamemode",
			description: "Modo de juego de juego a filtrar",
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
					value: "catch",
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

			const gamemode = interaction.options.getString(
				"gamemode",
				false
			) as OGamemodeName;

			const ret = (await QatApi.fetchUsers()) as QatUser[];

			return {
				message: await new OpenBNsResponse().getMessage(ret, gamemode),
			};
		} catch (e) {
			return {
				message: await new ErrorResponse().getMessage(e, logger),
			};
		}
	},
};
