import { SlashCommand, SlashCommandReturn } from "../models/slash-command";
import { User } from "../../models/user";
import { OUser } from "../../models/osu-api/user";
import { OsuApi } from "../../util/api/osu-api";
import { QatApi } from "../../util/api/qat-api";
import { QatUser, UserActivity } from "../../models/qat-api/qat";
import { BNStatsResponse } from "../responses/bn-stats";

export default <SlashCommand>{
	commandEnum: "BNSTATS",
	name: "bn-stats",
	description:
		"Muestra los datos como nominador de un BN/NAT en los ultimos 90 dias.",
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
	],
	async call({ interaction }): Promise<SlashCommandReturn> {
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

			const osuRet = (await OsuApi.fetchUserPublic(user, "osu")) as OUser;

			const qatRet = (await QatApi.fetchUsers(osuRet.id)) as QatUser;

			const qatActivRet = (await QatApi.fetchUserActivity(
				osuRet.id
			)) as UserActivity;

			return {
				message: await new BNStatsResponse().getMessage(
					osuRet,
					qatRet,
					qatActivRet
				),
			};
		} catch (e) {
			return {
				message: {
					content: "Error: " + e,
				},
			};
		}
	},
};
