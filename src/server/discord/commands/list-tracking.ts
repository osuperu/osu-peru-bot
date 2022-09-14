import { SlashCommand, SlashCommandReturn } from "../models/slash-command";
import { User, UserMappingTrack } from '../../models/user';
import { ErrorResponse } from '../responses/error';
import { ListTrackingResponse } from "../responses/list-tracking";

export default <SlashCommand>{
    commandEnum: "LISTTRACKING",
    name: "list-tracking",
    description: "Lista a los usuarios que están siendo trackeados",
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

            const isAnyUserInTracking = (await UserMappingTrack.findOne());

            if (!isAnyUserInTracking) {
				return {
					message: {
						content: `Ningún jugador está siendo trackeado por el momento.`,
					},
				};
			}

            const trackingUsersDb = (await UserMappingTrack.find()) as UserMappingTrack[]

            return {
                message: await new ListTrackingResponse().getMessage(trackingUsersDb)
            }

        } catch (e) {
            return {
                message: await new ErrorResponse().getMessage(e, logger),
            };
        }
    }
}