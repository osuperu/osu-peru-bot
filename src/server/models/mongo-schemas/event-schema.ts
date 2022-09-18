import { DateTime } from "luxon";
import Mongoose from "mongoose";

import { VotingUserInformationSchema } from "./voting-user-info-schema";

export const EventSchema = new Mongoose.Schema({
    startDate: {
        type: Date,
        default: () => DateTime.now().toJSDate(),
        required: true,
    },
    endDate: {
        type: Date,
        default: () => DateTime.now().toJSDate(),
        required: true,
    },
    title: { type: String, required: true },
    competitors: VotingUserInformationSchema,
    participants: VotingUserInformationSchema,
});