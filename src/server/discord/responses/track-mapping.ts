import { MessageOptions } from "discord.js";
import { App } from "../../app";
import { CommandResponse } from "../../models/command-response";
import { OUser } from "../../models/osu-api/user";
import { UserMappingTrack } from "../../models/user";

export class TrackMappingResponse implements CommandResponse {
	async getMessage(user: OUser): Promise<MessageOptions> {
		const userDb = await UserMappingTrack.findOne({ userID: user.id });

		if (userDb) {
			return {
				content: `El jugador ya está siendo trackeado.`,
			};
		}

		const userTracking = new UserMappingTrack();
		userTracking.userID = user.id;
		userTracking.save();

		return {
			content: `El jugador ${user.username} comenzó a ser trackeado en <#${App.instance.config.discord.tracking.mapping}>.`,
		};
	}
}
