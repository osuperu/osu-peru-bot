import { SlashCommand, SlashCommandReturn } from "../models/slash-command";
import { User } from "../../models/user";
import { OUser } from "../../models/osu-api/user";
import { OsuStatsResponse } from "../responses/osu-stats-response";
import { OsuApi } from "../../util/api/osu-api";
import { OGamemodeName } from "../../models/osu-api/gamemode";

export default <SlashCommand>{
	commandEnum: "OSUSTATS",
	name: "osu-stats",
	description: "Muestra información acerca de un jugador.",
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
		}
	],
	async call({ interaction }): Promise<SlashCommandReturn> {
		try {
            const guildMember = interaction.options.getUser("discord", false) || interaction.member.user;
            const userDb = await User.findOne({ "discord.userID": guildMember.id });

			if (!userDb) {
				return {
                    message: {
                        content: "El usuario no tiene ninguna cuenta de osu! vinculada."
                    }
                }
			}

            const user = interaction.options.getString("user", false) || (userDb ? userDb.osu.userID.toString() : null);
            const gamemode = (interaction.options.getString("gamemode", false) || (userDb ? userDb.osu.playmode : "osu")) as OGamemodeName;
			
			const ret = (await OsuApi.fetchUserPublic(
                user,
                gamemode
            )) as OUser;
    
            return {
                message: (new OsuStatsResponse).getMessage(ret, gamemode)
            }
        } catch (e) {
			return {
                message: {
                    content: "El usuario no existe.",
                }
            }
        }
	},
};
