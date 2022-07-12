import discord, { DiscordAPIError, CommandInteraction, Message } from "discord.js";
import { LogEntry } from "winston";

import { Logger } from '../util/logger';
import { App } from "../app";

import { CommandsManager } from "./commands-manager";
import { MessageManager } from "./message-manager";

export class DiscordClient {
	discordClient: discord.Client;
	logChannel!: discord.TextChannel;
	commandManager: CommandsManager;
	messageManager: MessageManager;

	constructor() {
		this.discordClient = new discord.Client({
            intents: [
                discord.Intents.FLAGS.GUILDS,
                discord.Intents.FLAGS.GUILD_MEMBERS,
                discord.Intents.FLAGS.GUILD_MESSAGES,
                discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
                discord.Intents.FLAGS.DIRECT_MESSAGES,
                discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
                discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
            ]
        });
        this.commandManager = new CommandsManager();
		this.messageManager = new MessageManager();
		
        this.discordClient.on("ready", () => {
            this.commandManager.init();
        });

        this.discordClient.on("interactionCreate", async interaction => {
            if (!interaction.isCommand) return;
            await this.commandManager.handleInteractions(interaction as CommandInteraction);
        });

		this.discordClient.on("messageCreate", async message => {
			await this.messageManager.handleMessage(message as Message);
		});
	}

	async start(token: string): Promise<void> {
		await this.discordClient.login(token).catch((error) => Logger.get("discord").error("Couldn't connect to discord!", { error }));
	}

	async stop(): Promise<void> {
		await this.commandManager.stop();
        this.discordClient.destroy();
	}

	get discordGuild(): discord.Guild {
		return this.discordClient.guilds.resolve(
			App.instance.config.discord.guildID as discord.Snowflake
		);
	}

	async fetchMember(id: string, ignoreCache = false): Promise<discord.GuildMember | null> {
		let discordMember = null;

		try {
			discordMember = await this.discordGuild?.members.fetch({
				user: id as discord.Snowflake,
				force: ignoreCache,
			});
		} catch (err) {
			if (!(err instanceof DiscordAPIError && (err.code === 10007 || err.code === 10013))) {
                throw err;
            }
		}

		return discordMember;
	}

	async log(info: LogEntry): Promise<void> {
		if (info.level in App.instance.config.logs.color) {
			if (!this.logChannel)
				this.logChannel = (await this.discordClient.channels.fetch(
					App.instance.config.discord
						.logChannel as discord.Snowflake
				)) as discord.TextChannel;

			await this.logChannel.send({
				embeds: [
					{
						title: info.label ? info.label : "",
						description: info.message,
						timestamp: info.timestamp,
						color: App.instance.config.logs.color[
							info.level
						],
					},
				],
			});
		}
	}
}
