import express from "express";
import http, { Server } from "http";
import mongoose from "mongoose";
import path from "path";

import { DateTime } from "luxon";
import { MainRouter } from "./router";

import { DiscordClient } from "./discord/discord-client";
import { Config } from "./util/config";
import { Cron } from "./util/cron";
import { Logger } from "./util/logger";

import moment from "moment";
import "moment/locale/es";
import EventEmitter from "events";

export class App {
	public static instance = new App();

	public app = express();
	public cron = new Cron();
	public discordClient = new DiscordClient();
	public logger = Logger.get();
	public config = new Config();
	public httpServer: Server;

	public clientCredential = {
		token: "",
		lastFetched: DateTime.now().minus({ days: 1 }),
	};

	constructor() {
		moment.locale("es");
		EventEmitter.defaultMaxListeners = 30;
		this.httpServer = http.createServer(this.app);
	}

	async start(): Promise<void> {
		this.app.use(
			express.static(path.join(__dirname, "static"), {
				dotfiles: "allow",
			})
		);

		this.app.use("/", new MainRouter().router);

		await this.discordClient.start(this.config.discord.token);

		await mongoose
			.connect(this.config.mongo.uri)
			.then(() => {
				this.logger.info(
					`Se ha conectado correctamente a la BD de MongoDB.`
				);
			})
			.catch(() => {
				this.logger.error(
					`Ha ocurrido un error al intentar conectarse a la BD de MongoDB.`
				);
			});

		mongoose.connection.on("error", (error) => {
			this.logger.error(
				"Ha ocurrido un error con la conexión a la BD de MongoDB.",
				{ error }
			);
		});

		this.cron.init();

		this.httpServer.listen(
			this.config.http.port,
			this.config.http.host,
			() => {
				this.logger.info(
					`Escuchando solicitudes HTTP en ${this.config.http.publicUrl} !`
				);
			}
		);

		this.httpServer.on("error", () => {
			this.logger.error(
				"Ha ocurrido un error mientras se escuchaban las solicitudes HTTP."
			);
		});
	}

	async stop(): Promise<void> {
		this.logger.info("Deteniendo la app...");
		this.cron.stop();

		this.httpServer.close((error) => {
			if (error) {
				this.logger.error(
					"Error durante el cierre del servidor HTTP.",
					{ error }
				);
			}
		});

		this.logger.info("Desconectandose de la BD de MongoDB...");
		await mongoose.connection.close();
		await this.discordClient.stop();
	}
}
