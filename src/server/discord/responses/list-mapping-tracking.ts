import { MessageOptions } from "discord.js";
import { CommandResponse } from "../../models/command-response";
import { UserMappingTrack } from "../../models/user";
import { OUser } from "../../models/osu-api/user";
import { OsuApi } from "../../util/api/osu-api";

export class ListMappingTrackingResponse implements CommandResponse {
	async getMessage(
		UsersInTracking: UserMappingTrack[],
		offset: number
	): Promise<MessageOptions> {
		let user: OUser = null;
		let content = "";
		for (const TrackedUser of UsersInTracking) {
			user = (await OsuApi.fetchUserPublic(
				TrackedUser.userID.toString(),
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
						text: `Pagina ${offset + 1}`,
					},
				},
			],
		};
	}
}
