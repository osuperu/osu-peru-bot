import { MessageOptions } from "discord.js";
import { CommandResponse } from "../../models/command-response";
import { UserMappingTrack } from "../../models/user";
import { OUser } from "../../models/osu-api/user";
import { OsuApi } from "../../util/api/osu-api";

export class ListMappingTrackingResponse implements CommandResponse {
	async getMessage(
		usersInTracking: UserMappingTrack[],
		offset: number,
		totalPages: number
	): Promise<MessageOptions> {
		let user: OUser = null;
		let content = "";
		for (const trackedUser of usersInTracking) {
			user = (await OsuApi.fetchUserPublic(
				trackedUser.userID.toString(),
				"osu"
			)) as OUser;
			content += `▸ ${user.username}` + "\n";
		}

		return {
			embeds: [
				{
					title: `Mostrando usuarios trackeados`,
					description: content,
					footer: {
						text: `Pagina ${offset + 1}/${totalPages}`,
					},
				},
			],
		};
	}
}
