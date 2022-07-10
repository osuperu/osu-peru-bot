import { Handler } from "express";
import mongoose from "mongoose";
import { ErrorCode } from "./util/error-codes";
import { User } from "./models/user";

const isAuthenticated: Handler = (req, res, next) => {
	if (!req.user) {
		throw ErrorCode.NOT_AUTHENTICATED;
	}
	next();
};

const discordAlreadyLinked: Handler = (req, res, next) => {
	if ((req.user as User).discord) {
		throw ErrorCode.ALREADY_AUTHENTICATED;
	}
	next();
};

const isDatabaseAvailable: Handler = (req, res, next) => {
	if (mongoose.connection.readyState !== 1) {
		throw ErrorCode.TEMPORARILY_UNAVAILABLE;
	}
	next();
};

export { isAuthenticated, discordAlreadyLinked, isDatabaseAvailable };
