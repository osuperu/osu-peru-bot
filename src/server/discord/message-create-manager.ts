import { Message } from "discord.js";
import { BaseManager } from "./models/base-manager";
import { MessageCreateEvent } from "./models/message-create-event";

import * as fs from "fs";
import * as path from "path";

export class MessageCreateManager extends BaseManager {
	private events: MessageCreateEvent[] = [];

	constructor() {
		super();

		const eventsDir = path.resolve(__dirname, "events/message-create");
		const dirFiles = fs.readdirSync(eventsDir);
		const eventFiles = dirFiles.filter(
			(file) => path.extname(file) === ".js"
		);

		eventFiles.forEach((commandFile) => {
			const event = this.importEvent(commandFile);
			event.fileName = commandFile;
			this.events.push(event);
		});
	}

	init(): void | Promise<void> {
		throw new Error("Metodo no implementado.");
	}

	stop(): void | Promise<void> {
		throw new Error("Metodo no implementado.");
	}

	private importEvent(filename: string): MessageCreateEvent {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		return require(`./events/message-create/${filename}`)
			.default as MessageCreateEvent;
	}

	async handleMessage(message: Message): Promise<void> {
		this.events.forEach((event) => {
			event.call({ message });
		});
	}
}
