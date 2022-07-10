import { CommandInteraction, MessageOptions, ChatInputApplicationCommandData } from "discord.js";

export interface SlashCommand extends ChatInputApplicationCommandData {
	commandEnum: string;
	fileName?: string;
	call: (obj?: SlashCommandObject) => SlashCommandReturn | Promise<SlashCommandReturn>;
}

export interface SlashCommandReturn {
	message: MessageOptions;
	edit_promise?: SlashCommandReturn | Promise<SlashCommandReturn>;
}

export interface SlashCommandObject {
	interaction: CommandInteraction;
}
