import { MessageOptions } from 'discord.js';
import { CommandResponse } from '../../models/command-response';
import { UserMappingTrack } from '../../models/user';
import { OUser } from '../../models/osu-api/user';
import { OsuApi } from '../../util/api/osu-api';
export class ListTrackingResponse implements CommandResponse {
    async getMessage(UsersInTracking: UserMappingTrack[]): Promise<MessageOptions> {
        let user: OUser = null;
        let content = "";
        for (const TrackedUser of UsersInTracking) {
            user = (await OsuApi.fetchUserPublic(TrackedUser.userID.toString(10), "osu")) as OUser;
            content = content.concat(`▸ ${user.username}\n`)
        }
        return {
            "embeds": [
                {
                    "type": "rich",
                    "title": `Mostrando usuarios trackeados`,
                    "description":
                        content,
                    "color": 0x00FFFF
                }
            ]
        }
    }
}