import { Logger } from "../util/logger";
import { Script } from "../models/script";
import { App } from "../app";

/**
 * Temporary script to delete previously registered slash commands leftovers
 * that no longer exist after the app rewrite.
 * It's a one-time use script so after it's' used, it'll' no longer work
 * unless you edit the ids of the slash commands that are hardcoded.
 *
 * @var commandsID - Hardcoded ID's
 */
export default class DeleteOldCommands implements Script {
	logger = Logger.get("scripts/delete-old-commands");
	commandsID = [
		"978379860743421972",
		"978532990344912906",
		"978379861695545405",
		"978379948333092874",
	];

	async run(): Promise<void> {
		for (const command of this.commandsID) {
			App.instance.discordClient.discordGuild.commands
				.delete(command)
				.then((res) => {
					this.logger.info("Comando slash eliminado correctamente.", {
						res,
					});
				})
				.catch((error) => {
					this.logger.error(
						"Hubo un problema al intentar eliminar el comando slash.",
						{ error }
					);
				});
		}
	}
}
