import Mongoose from "mongoose";
import { DateTime } from "luxon";

import { OsuInformationSchema } from "./osu-info-schema";
import { DiscordInformationSchema } from "./discord-info-schema";

export const UserSchema = new Mongoose.Schema({
	registration: { type: Date, default: () => DateTime.now().toJSDate() },
	lastLogin: { type: Date, default: () => DateTime.now().toJSDate() },
	osu: OsuInformationSchema,
	discord: DiscordInformationSchema,
});
