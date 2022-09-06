import { BaseManager } from "./models/base-manager";
import { SlashCommand } from "./models/slash-command";
import { ApplicationCommand, CommandInteraction } from "discord.js";

import * as fs from "fs";
import * as path from "path";
import { App } from "../app";

import { Logger } from "../util/logger";
const logger = Logger.get("SlashCommand");

export class CommandsManager extends BaseManager {
	private commands: SlashCommand[] = [];
	private initializedCommands: ApplicationCommand[] = [];

	// All slash commands inside the 'commands' folder are read
	constructor() {
		super();

		const commandsDir = path.resolve(__dirname, "commands");
		const dirFiles = fs.readdirSync(commandsDir);
		const commandFiles = dirFiles.filter(
			(file) => path.extname(file) === ".js"
		);

		commandFiles.forEach((commandFile) => {
			const command = this.importCommand(commandFile);
			command.fileName = commandFile;
			this.commands.push(command);
		});
	}

	init(): void {
		this.commands.forEach(async (command) => {
			await this.initCommand(command);
		});
	}

	async stop(): Promise<void> {
		await App.instance.discordClient.discordGuild.commands.set([]);
	}

	private importCommand(filename: string): SlashCommand {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		return require(`./commands/${filename}`).default as SlashCommand;
	}

	async initCommand(command: SlashCommand): Promise<void> {
		if (this.commands.indexOf(command) === -1) this.commands.push(command);

		const existingAppCommandIndex = this.initializedCommands.findIndex(
			(c) => c["commandEnum"] == command.commandEnum
		);

		if (existingAppCommandIndex > -1) {
			const existingAppCommand =
				this.initializedCommands[existingAppCommandIndex];
			await existingAppCommand.delete();
			this.initializedCommands.splice(existingAppCommandIndex, 1);
		}

		const appCommand =
			await App.instance.discordClient.discordGuild.commands.create({
				...command,
			});
		appCommand["commandEnum"] = command.commandEnum;
		this.initializedCommands.push(appCommand);
	}

	async handleInteractions(interaction: CommandInteraction): Promise<void> {
		try {
			await interaction.deferReply();

			const command = this.commands.find(
				(command) => command.name === interaction.commandName
			);

			const commandReturn = await command.call({ interaction, logger });

			interaction.editReply(commandReturn.message);

			if (commandReturn.edit_promise) {
				Promise.resolve(commandReturn.edit_promise).then((edit) => {
					interaction.editReply(edit.message);
				});
			}
		} catch (error) {
			logger.error(
				"Ocurrio un error al intentar interactuar con un slash command",
				{ error }
			);
		}
	}

	getAppCommand(commandEnum: string): ApplicationCommand {
		return this.initializedCommands.find(
			(e) => e["commandEnum"] == commandEnum
		);
	}

	getCommand(commandEnum: string): SlashCommand {
		return this.commands.find((e) => e["commandEnum"] == commandEnum);
	}
}
