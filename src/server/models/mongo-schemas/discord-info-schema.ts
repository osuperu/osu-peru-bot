import Mongoose from "mongoose";
import { DateTime } from "luxon";

export const DiscordInformationSchema = new Mongoose.Schema({
	userID: String,
	userNameWithDiscriminator: String,
	accessToken: String,
	refreshToken: String,
	dateAdded: { type: Date, default: () => DateTime.now().toJSDate() },
	lastUpdated: { type: Date, default: () => DateTime.now().toJSDate() },
});
