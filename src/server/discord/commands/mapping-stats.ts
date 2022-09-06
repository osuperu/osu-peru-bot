import { SlashCommand, SlashCommandReturn } from '../models/slash-command';
import { OsuApi } from '../../util/api/osu-api';
import { OUser } from '../../models/osu-api/user';
import { ErrorResponse } from '../responses/error';
import { User } from '../../models/user';
import { MappingStatsResponse } from '../responses/mapping-stats';

export default <SlashCommand>{
    commandEnum: "MPGSTATS",
    name: "mappingstats",
    description: "Muestra información sobre los mapas de un jugador",
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
        }
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
            const ret = await OsuApi.fetchUserPublic(user, "fruits") as OUser;

            return {
                message: await new MappingStatsResponse().getMessage(ret),
            };
        } catch (e) {
            return {
                message: await new ErrorResponse().getMessage(e, logger),
            };
        }
    }
};