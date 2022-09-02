import { MessageOptions } from "discord.js";
import { CommandResponse } from "../../models/command-response";
import { User } from "../../models/user";

export class ForceDelinkResponse implements CommandResponse {
	async getMessage(user: User): Promise<MessageOptions> {
		if (!user) {
			return {
				content:
					"No se puede encontrar al usuario en la base de datos.",
			};
		}

		if (user.discord) {
			await user.discord.delink();
			user.discord = undefined;
			await user.save();
			return {
				content: "Se ha desvinculado al usuario correctamente.",
			};
		} else {
			return {
				content:
					"Este usuario no tiene ninguna información de discord.",
			};
		}
	}
}
