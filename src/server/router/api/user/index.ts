import promiseRouter from "express-promise-router";
import { isDatabaseAvailable } from "../../../middlewares.js";
import { AppRequest } from "../../../models/app-request";

export class UserRouter {
	public readonly router = promiseRouter();

	constructor() {
		this.router.get(
			"/",
			isDatabaseAvailable,
			async (req: AppRequest, res) => {
				res.json({
					error: false,
					user: (req.user) ? req.user.getInfos() : null,
				});
			}
		);
	}
}
