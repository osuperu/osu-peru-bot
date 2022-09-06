import { MessageOptions } from "discord.js";
import { CommandResponse } from "../../models/command-response";
import Winston from "winston";

export class ErrorResponse implements CommandResponse {
	async getMessage(
		error: unknown,
		logger?: Winston.Logger
	): Promise<MessageOptions> {
		if (logger) {
			logger.error("Ha ocurrido un error interno en el comando slash, se ha guardado mas informacion en los logs del servidor.", {
				error,
			});
		}

		return {
			content:
				"Ha ocurrido un error interno. Puedes pedirle a un admin que revise los logs para más información.",
		};
	}
}
