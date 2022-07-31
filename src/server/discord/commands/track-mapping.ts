import { OUser } from "../../models/osu-api/user";
import { User } from "../../models/user";
import { OsuApi } from "../../util/api/osu-api";
import { SlashCommand, SlashCommandReturn } from "../models/slash-command";
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
		}
    ],
    async call({ interaction }): Promise<SlashCommandReturn> {
        try {
            const userDb = await User.findOne({ "discord.userID": interaction.member.user.id });
            
            if (!userDb) {
				return {
                    message: {
                        content: "El usuario no tiene ninguna cuenta de osu! vinculada."
                    }
                }
			}

            const user = interaction.options.getString("user", true);

            const ret = (await OsuApi.fetchUserPublic(
                user,
                "osu"
            )) as OUser;

            return {
                message: await (new TrackMappingResponse).getMessage(ret)
            }
        } catch (e) {
            return {
                message: {
                    content: "El usuario no existe.",
                }
            }
        }
    }
}