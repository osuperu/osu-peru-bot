import express from "express";
import http from "http";
import mongoose from "mongoose";
import path from "path";

import { DateTime } from "luxon";
import { MainRouter } from "./router";

import { DiscordClient } from "./discord/discord-client";
import { Config } from "./util/config";
import { Cron } from "./util/cron";
import { Logger } from "./util/logger";

export class App {
	public static instance = new App();

	public app = express();
	public cron = new Cron();
	public discordClient = new DiscordClient();
	public logger = Logger.get();
	public config = new Config();
	public httpServer: http.Server;

	public clientCredential = {
		token: "",
		lastFetched: DateTime.now().minus({ days: 1 }),
	};

	constructor() {
		this.httpServer = http.createServer(this.app);
	}

	async start(): Promise<void> {
		this.app.use(
			express.static(path.join(__dirname, "static"), {
				dotfiles: "allow",
			})
		);
		
		this.app.use("/", new MainRouter().router);

		mongoose.connect(this.config.mongo.uri);

		await this.discordClient.start(this.config.discord.token);

		this.cron.init();

		this.httpServer.listen(
			this.config.http.port,
			this.config.http.host,
			() => {
				this.logger.info(`Listening HTTP requests on ${this.config.http.publicUrl} !`);
			}
		);
		
	}

	async stop(): Promise<void> {
		this.logger.info("Stopping the app!");

		await this.discordClient.stop();

		this.cron.stop();
		
		this.httpServer.close((error) => {
			if (error) {
				this.logger.error("Error while closing the http server!", { error });
			}
		});

		this.logger.info("Stopped the app!");
	}
}
