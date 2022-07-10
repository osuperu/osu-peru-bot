import mongoose from "mongoose";

import { Logger } from "../util/logger";
import { App } from "../app";
import { User } from "../models/user";
import { Script } from "../models/script";

export default class RefreshAllUsers implements Script {
	logger = Logger.get("scripts/refresh-all-users");

	CONCURRENCY = 10;
	STEP_TIMEOUT = 30 * 1000;

	async run(): Promise<void> {
		if (
			mongoose.connection.readyState !== 0 &&
			App.instance.discordClient.discordClient.ws.status === 0
		) {
			this.logger.info("Fetching users!");
			const users = await User.find({ discord: { $exists: true } });
			this.logger.info(`Found ${users.length} users to refresh!`);
			const pendingUsers = [...users];

			while (pendingUsers.length > 0) {
				const promises = [];
				const currentUsers = pendingUsers.splice(0, this.CONCURRENCY);
				for (const user of currentUsers)
					promises.push(
						user
							.updateUser()
							.catch((error) =>
								this.logger.error(
									"An error occured while processing this user",
									{ error, user }
								)
							)
					);

				promises.push(
					new Promise((resolve) => {
						setTimeout(() => {
							resolve();
						}, this.STEP_TIMEOUT);
					}) as Promise<void>
				);

				await Promise.all(promises);
				this.logger.info(
					"Processed " +
						(users.length - pendingUsers.length) +
						" out of " +
						users.length
				);
			}

			this.logger.info("Refreshing users done!");
		} else {
			this.logger.error(
				"Cancelled the script because of connection error!"
			);
		}
	}
}
