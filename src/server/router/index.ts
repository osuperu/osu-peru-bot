import express from "express";
import promiseRouter from "express-promise-router";
import { ApiRouter } from "./api/index";

import { Logger } from "../util/logger";

export class MainRouter {
	public readonly router = promiseRouter();

	constructor() {
		this.router.use("/api", (new ApiRouter).router);

		this.router.use("/", express.static("build/client"));
		this.router.use("*", express.static("build/client/index.html"));

		this.router.use((err, req, res, next) => {
			if (err) {
				if (err.custom) {
					if (req.api) {
						res.status(err.httpCode).json({ error: err.name });
					} else {
						res.status(err.httpCode).send(err.name);
					}

					if (err.logout && !res.headersSent) {
						req.session.destroy();
						req.logout();
					}
				} else {
					Logger.get("Router").error(
						`Error occured on ${req.originalUrl}`,
						{ error: err, message: err.message, stack: err.stack }
					);
					if (!res.headersSent) {
						if (req.api)
							res.status(500).json({
								error: "Internal Server Error",
							});
						else res.status(500).send("Internal Server Error");
					}
				}
			} else {
				next();
			}
		});
	}
}
