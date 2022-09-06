import { OUser } from "../../models/osu-api/user";
import { User, UserMappingTrack } from "../../models/user";
import { OsuApi } from "../../util/api/osu-api";
import { SlashCommand, SlashCommandReturn } from "../models/slash-command";
import { ErrorResponse } from "../responses/error";
import { TrackMappingResponse } from "../responses/track-mapping";

export default <SlashCommand>{
	commandEnum: "TRACKMAPPING",
	name: "track-mapping",
	description: "Add a user to the mapping tracker",
	options: [
		{
			name: "user",
			description:
				"Nombre de usuario o ID del jugador cuyas estadísticas quieres ver",
			type: "STRING",
			required: true,
		},
	],
	async call({ interaction, logger }): Promise<SlashCommandReturn> {
		try {
			const userDb = await User.findOne({
				"discord.userID": interaction.member.user.id,
			});

			if (!userDb) {
				return {
					message: {
						content:
							"El usuario no tiene ninguna cuenta de osu! vinculada.",
					},
				};
			}

			const user = interaction.options.getString("user", true);
			const ret = (await OsuApi.fetchUserPublic(user, "osu")) as OUser;
			const trackedUserDb = await UserMappingTrack.findOne({
				userID: ret.id,
			});

			if (trackedUserDb) {
				return {
					message: {
						content: `El jugador ya está siendo trackeado.`,
					},
				};
			}

			const newTrackedUser = new UserMappingTrack();
			newTrackedUser.userID = ret.id;
			newTrackedUser.save();

			return {
				message: await new TrackMappingResponse().getMessage(ret),
			};
		} catch (e) {
			return {
				message: await new ErrorResponse().getMessage(e, logger),
			};
		}
	},
};
