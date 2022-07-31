import { App } from "../../../app";
import { MessageCreateEvent } from "../../models/message-create-event";
import { Logger } from "../../../util/logger";

const logger = Logger.get("MappingTimestampHandler");

export default <MessageCreateEvent>{
	async call({ message }): Promise<void> {
		try {
			const channel =
				App.instance.config.discord.eventHandlers.channels.mappingTimestamp.find(
					(channel) => channel === message.channelId
				);

			if (channel) {
				const regexp = /(\d\d:\d\d:\d{3} (?:\(\d+(?:,\d+)*\)))? -(.*)?$/g;
				const match = regexp.exec(message.content);

				if (match !== null) {
					message.channel.send({
						content:
							"<osu://edit/" + match[1].replace(" ", "-") + ">\n",
					});
				}
			}
		} catch (err) {
			logger.error(err);
		}
	},
};
