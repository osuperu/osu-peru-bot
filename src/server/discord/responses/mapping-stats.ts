import { MessageOptions } from "discord.js";
import { CommandResponse } from "../../models/command-response";
import { OUser } from '../../models/osu-api/user';

export class MappingStatsResponse implements CommandResponse {
    async getMessage(user: OUser): Promise<MessageOptions> {
        return {
            embeds: [
                {
                    author: {
                        name: user.username,
                        url: `https://osu.ppy.sh/users/${user.id}`,
                        icon_url: `https://osu.ppy.sh/images/flags/${user.country.code}.png`
                    },
                    thumbnail: {
                        url: user.avatar_url,
                    },
                    description:
                        `▸ **Graveyarded maps:** ${user.graveyard_beatmapset_count}` + "\n" +
                        `▸ **Pending maps:** ${user.pending_beatmapset_count}` + "\n" +
                        `▸ **Loved maps:** ${user.loved_beatmapset_count}` + "\n" +
                        `▸ **Ranked and approved maps:** ${user.ranked_beatmapset_count}`,
                    footer: {
                        text: `Kudosu Available: ${user.kudosu.available}/${user.kudosu.total}`,
                    },
                }
            ]
        }
    }

}