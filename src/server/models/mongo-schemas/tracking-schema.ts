import Mongoose from "mongoose";
import { DateTime } from "luxon";

export const TrackingSchema = new Mongoose.Schema({
	userID: { type: Number, required: true },
	lastUpdated: {
		type: Date,
		default: () => DateTime.now().toJSDate(),
		required: true,
	},
});
