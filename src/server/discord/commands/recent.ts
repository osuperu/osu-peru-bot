import { SlashCommand, SlashCommandReturn } from "../models/slash-command";
import { User } from "../../models/user";
import { OUser } from "../../models/osu-api/user";
import { OScore } from "../../models/osu-api/score"
import { OsuApi } from "../../util/api/osu-api";
import { RecentResponse } from "../responses/recent";

export default <SlashCommand>{
	commandEnum: "RECENT",
	name: "recent",
	description: "Muestra una jugada reciente de un jugador.",
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
				"Modo de juego de juego vinculado al jugador cuya jugada reciente quieres ver",
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
		{
			name: "fails",
			description: "Incluye plays fallidas o no",
			type: "STRING",
			choices: [
				{
					name: "no",
					value: "0",
				},
				{
					name: "si",
					value: "1",
				},
			],
			required: false,
		},
	],
    async call({ interaction }): Promise<SlashCommandReturn> {
        try {
            const guildMember = interaction.options.getUser("discord", false) || interaction.member.user;
            const userDb = await User.findOne({ "discord.userId": guildMember.id });
            const user = interaction.options.getString("user", false) || (userDb ? userDb.osu.userID.toString() : null);
            const gamemode = (interaction.options.getString("gamemode", false) || "osu") as "osu" | "mania" | "fruits" | "taiko";
            const offset = interaction.options.getInteger("offset", false) || 0;
            const includeFails = (interaction.options.getString("fails", false) || "1") as "0" | "1";

            const osuUser = (await OsuApi.fetchUserPublic(
                user,
                gamemode
            )) as OUser;

            const ret = (await OsuApi.fetchUserRecentPlay(
                osuUser.id,
                gamemode,
                1, // Return just 1 play
                offset,
                includeFails
            ))[0] as OScore;

            if (!userDb) {
                return {
                    message: {
                        content: "El usuario no tiene ninguna cuenta de osu! vinculada."
                    }
                }
            }

            return {
                message: await (new RecentResponse).getMessage(osuUser, ret, gamemode)
            }

        } catch (e) {
            return {
                message: {
                    content: "El usuario no tiene plays recientes en ese modo de juego."
                }
            }
        }
    }
};
