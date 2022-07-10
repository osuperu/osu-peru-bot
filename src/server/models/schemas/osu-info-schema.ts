import Mongoose from "mongoose";
import { DateTime } from "luxon";

export const OsuInformationSchema = new Mongoose.Schema({
	userID: { type: Number, required: true },
	playmode: { type: String, required: true },
	groups: { type: [String], default: [], required: true },
	isRankedMapper: { type: Boolean, default: false, required: true },
	username: { type: String, required: true },
	country_code: { type: String, required: true },
	isRestricted: { type: Boolean, default: false, required: true },
	accessToken: { type: String, required: true },
	refreshToken: { type: String, required: true },
	dateAdded: {
		type: Date,
		default: () => DateTime.now().toJSDate(),
		required: true,
	},
	lastVerified: {
		type: Date,
		default: () => DateTime.now().toJSDate(),
		required: true,
	},
});
