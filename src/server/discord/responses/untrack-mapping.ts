import { MessageOptions } from "discord.js";
import { CommandResponse } from "../../models/command-response";
import { UserMappingTrack } from "../../models/user";
import { OUser } from "../../models/osu-api/user";
import { App } from "../../app";

export class UntrackMappingResponse implements CommandResponse {
	async getMessage(user: OUser): Promise<MessageOptions> {
		const userDb = await UserMappingTrack.findOne({ userID: user.id });

		if (!userDb) {
			return {
				content: `El jugador ${user.username} no se encuentra trackeado.`,
			};
		}

		userDb.delete();
		return {
			content: `El jugador ${user.username} dejo de ser trackeado en <#${App.instance.config.discord.tracking.mapping}>.`,
		};
	}
}
