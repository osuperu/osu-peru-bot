import { User } from "../../models/user";
import { SlashCommand, SlashCommandReturn } from "../models/slash-command";
import { ErrorResponse } from "../responses/error";
import { ForceDelinkResponse } from "../responses/force-delink";

export default <SlashCommand>{
	commandEnum: "FORCEDELINK",
	name: "forcedelink",
	description: "Fuerza el desvinculamiento de cuentas de cualquier usuario.",
	options: [
		{
			name: "osu",
			description: "Desvincula a un usuario usando su cuenta de osu!",
			type: "SUB_COMMAND",
			options: [
				{
					name: "user",
					description:
						"Nombre de usuario o ID del jugador cuyas cuentas deseas desvincular",
					type: "STRING",
					required: true,
				},
			],
		},
		{
			name: "discord",
			description: "Desvincula a un usuario usando su cuenta de Discord",
			type: "SUB_COMMAND",
			options: [
				{
					name: "user",
					description:
						"Usuario de discord cuyas cuentas deseas desvincular",
					type: "STRING",
					required: true,
				},
			],
		},
	],
	async call({ interaction, logger }): Promise<SlashCommandReturn> {
		try {
			const type = interaction.options.getSubcommand();

			let user: User | null;

			if (type == "discord") {
				const guildMember = interaction.options.getUser("user", false);

				if (guildMember) {
					user = await User.findOne({
						"discord.userID": guildMember.id,
					});
				} else {
					user = null;
				}
			} else if (type == "osu") {
				user = await User.byOsuResolvable(
					interaction.options.getString("user")
				);
			} else {
				user = null;
			}

			return {
				message: await new ForceDelinkResponse().getMessage(user),
			};
		} catch (e) {
			return {
				message: await new ErrorResponse().getMessage(e, logger),
			};
		}
	},
};
