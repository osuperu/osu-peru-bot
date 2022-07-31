import { MessageOptions } from "discord.js";
import { App } from "../../app";
import { CommandResponse } from "../../models/command-response";
import { OUser } from "../../models/osu-api/user";

export class TrackMappingResponse implements CommandResponse {
	async getMessage(user: OUser): Promise<MessageOptions> {
		return {
			content: `El jugador ${user.username} comenzó a ser trackeado en <#${App.instance.config.discord.tracking.mapping}>.`,
		};
	}
}
