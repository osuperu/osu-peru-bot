import mongoose from "mongoose";

import { spawn } from "child_process";
import { parse } from "mongodb-uri";
import { join } from "path";
import { DateTime } from "luxon";

import { Logger } from "../util/logger";
import { App } from "../app";
import { Script } from "../models/script";

export default class BackupDatabase implements Script {
	logger = Logger.get("scripts/backup-database");

	async run(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (mongoose.connection.readyState !== 0) {
				this.logger.info("Trying to backup database!");
				const parsedUri = parse(App.instance.config.mongo.uri);

				if (parsedUri.hosts.length < 1 || !parsedUri.database)
					reject("Please correctly configure your mongo settings!");

				const mongodump = spawn("mongodump", [
					"--host",
					parsedUri.hosts[0].host,
					"--port",
					parsedUri.hosts[0].port.toString(),
					"--db",
					parsedUri.database,
					"--out",
					join(
						__dirname,
						"../../../",
						App.instance.config.mongo.backupDir,
						DateTime.now().toFormat("LL-dd-yy")
					),
				]);

				mongodump.on("close", (code) => {
					if (code > 0) {
						this.logger.error("Mongodump exited with code " + code);
						reject("An error occured during mongodump process.");
					}
					this.logger.info("Database backup done!");
					resolve();
				});
			} else {
				reject("Cancelled the script because of connection error!");
			}
		});
	}
}
