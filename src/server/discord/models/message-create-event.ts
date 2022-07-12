import { Message } from "discord.js";

export interface MessageCreateEvent {
    fileName?: string;
    call: (obj?: MessageCreateEventObject) => void | Promise<void>;
}

export interface MessageCreateEventObject {
    message: Message;
}