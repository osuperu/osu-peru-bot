import Winston, { LogEntry } from "winston";
import WinstonDailyRotateFile from "winston-daily-rotate-file";
import Transport from "winston-transport";
import { ConsoleTransportOptions } from "winston/lib/winston/transports";

import { App } from "../app";

class DiscordTransport extends Transport {
	constructor(opts?: ConsoleTransportOptions) {
		super(opts);
	}

	log(info: LogEntry, callback: () => void) {
		App.instance.discordClient.log(info);
		callback();
	}
}

export abstract class Logger {
	static transports = [
		new Winston.transports.Console({
			level: "unprioritized",
			format: Winston.format.simple(),
		}),
		new WinstonDailyRotateFile({
			dirname: "data/logs/",
			filename: "%DATE%.log",
			level: "info",
		}),
		new DiscordTransport(),
	];

	static get(label?: string): Winston.Logger {
		return Winston.createLogger({
			format: Winston.format.combine(
				Winston.format.label({ label }),
				Winston.format.timestamp(),
				Winston.format.json()
			),
			transports: Logger.transports,
			levels: {
				error: 0,
				warn: 1,
				success: 2,
				info: 3,
				unprioritized: 4,
			},
		});
	}
}
