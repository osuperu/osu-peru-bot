import { CronJob } from "cron";
import { DateTime } from "luxon";

import { Logger } from "./logger";
import RefreshAllUserData from "../scripts/refresh-all-users";
import BackupDatabase from "../scripts/backup-database";

import { Script } from "../models/script";
import MappingTracking from "../scripts/mapping-tracking";
export class Cron {
	tasks: Array<CronJob> = [];
	logger = Logger.get("cron");

	init(): void {
		this.tasks.push(
			new CronJob("0 0 0 * * *", async () => {
				// Midnight
				try {
					this.logger.info("Executing daily user data refresh task!");
					await new RefreshAllUserData().run();
					this.logger.info(
						"Successfully completed the refresh task!"
					);
				} catch (err) {
					this.logger.error(
						"An error occured while executing refresh task!",
						{ err }
					);
				}
			})
		);

		this.tasks.push(
			new CronJob("0 0 2 * * 1", async () => {
				// Every monday at 2 AM
				try {
					this.logger.info("Executing weekly database backup task!");
					await new BackupDatabase().run();
					this.logger.info(
						"Successfully completed the database backup task!"
					);
				} catch (err) {
					this.logger.error(
						"An error occured while executing database backup task!",
						{ err }
					);
				}
			})
		);

		this.tasks.push(
			new CronJob("* * * * *", async () => {
				// Every minute
				try {
					await new MappingTracking().run();
				} catch (err) {
					this.logger.error(
						"An error occured while executing osu tracking task!",
						{ err }
					);
				}
			})
		);

		for (const task of this.tasks) {
			task.start();
		}
	}

	stop(): void {
		this.tasks.forEach((task) => task.stop());
	}

	runScriptManually(scriptName: string): string {
		let module: Script;
		const runDate = DateTime.now().plus({ seconds: 30 });
		try {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			module = new (require("../scripts/" +
				scriptName +
				".js").default)() as Script;

			const manualJob = new CronJob(runDate.toJSDate(), async () => {
				try {
					await module.run();
					manualJob.stop();
					this.tasks.splice(this.tasks.indexOf(manualJob), 1);
				} catch (err) {
					this.logger.error(
						"An error occured while executing manual task!",
						{ err }
					);
					manualJob.stop();
					if (this.tasks.includes(manualJob)) {
						this.tasks.splice(this.tasks.indexOf(manualJob), 1);
					}
				}
			});
			this.tasks.push(manualJob);
			manualJob.start();
			return (
				"Scheduled to run script `" +
				scriptName +
				"` at " +
				runDate.toLocaleString(DateTime.TIME_24_WITH_SHORT_OFFSET)
			);
		} catch (error) {
			this.logger.error("Failed to import module " + scriptName, {
				error,
			});
			throw error;
		}
	}
}
