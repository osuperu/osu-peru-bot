import Mongoose from "mongoose";

export const VotingUserInformationSchema = new Mongoose.Schema({
    userID: { type: Number, required: true },
    voters: { type: [Number], default: [], required: true },
})