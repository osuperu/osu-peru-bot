import { SlashCommand, SlashCommandReturn } from "../models/slash-command";
import { User, UserMappingTrack } from "../../models/user";
import { ErrorResponse } from "../responses/error";
import { ListMappingTrackingResponse } from "../responses/list-mapping-tracking";

export default <SlashCommand>{
	commandEnum: "LISTTRACKING",
	name: "list-mapping-track",
	description: "Lista a los usuarios que están siendo trackeados (Mapping)",
	options: [
		{
			name: "offset",
			description: "Especifique la página a mostrar, comenzando desde 0.",
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

			const totalTrackedUsers = (await UserMappingTrack.find()
				.count()) as number;

			if (totalTrackedUsers === 0) {
				return {
					message: {
						content: `Ningún jugador está siendo trackeado por el momento.`,
					},
				};
			}

			const offset = interaction.options.getInteger("offset", false) || 0;
			const limit = 10;

			const ret = (await UserMappingTrack.find()
				.skip(offset * limit)
				.limit(limit)) as UserMappingTrack[];

			const totalPages = (totalTrackedUsers % 10 === 0 ?
				Math.floor(totalTrackedUsers / limit):
				Math.floor(totalTrackedUsers / limit) + 1);

			return {
				message: await new ListMappingTrackingResponse().getMessage(
					ret, offset, totalPages
				),
			};
		} catch (e) {
			return {
				message: await new ErrorResponse().getMessage(e, logger),
			};
		}
	},
};