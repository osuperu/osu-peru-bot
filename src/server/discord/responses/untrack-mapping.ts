import { MessageOptions } from "discord.js";
import { CommandResponse } from "../../models/command-response";
import { OUser } from "../../models/osu-api/user";
import { App } from "../../app";

export class UntrackMappingResponse implements CommandResponse {
	async getMessage(user: OUser): Promise<MessageOptions> {		
		return {
			content: `El jugador ${user.username} dejo de ser trackeado en <#${App.instance.config.discord.tracking.mapping}>.`,
		};
	}
}
