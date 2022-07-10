import { MessageOptions } from "discord.js";

export interface CommandResponse {
	getMessage(...args: unknown[]): MessageOptions;
}
