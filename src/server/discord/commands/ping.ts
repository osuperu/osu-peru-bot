import { SlashCommand, SlashCommandReturn } from "../models/slash-command";

export default <SlashCommand>{
	commandEnum: "PING",
	name: "ping",
	description: "Ping!",
	options: [
		{
			name: "text",
			description: "A test slash command",
			type: "STRING",
		},
	],
	call({ interaction }): SlashCommandReturn {
		const text = interaction.options.getString("text", false);

		if (text) {
			return { message: { content: `Pong! Your message was ${text}` } };
		} else {
			return { message: { content: "Pong!" } };
		}
	},
};
