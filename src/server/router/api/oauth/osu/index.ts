import promiseRouter from "express-promise-router";
import passport from "passport";
import { ErrorCode } from "../../../../util/error-codes";
import { isDatabaseAvailable } from "../../../../middlewares";
import { AppRequest } from "../../../../models/app-request";

export class OsuOAuthRouter {
	public readonly router = promiseRouter();

	constructor() {
		this.router.get(
			"/",
			isDatabaseAvailable,
			passport.authenticate("osu", { scope: ["identify"] })
		);

		this.router.get(
			"/callback",
			isDatabaseAvailable,
			passport.authenticate("osu", { failureRedirect: "/" }),
			async (req: AppRequest, res) => {
				if (!req.query.code || req.query.error) {
					throw ErrorCode.MISSING_PARAMETERS;
				}

				res.redirect("/");
			}
		);
	}
}
