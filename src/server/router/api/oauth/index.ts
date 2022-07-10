import promiseRouter from "express-promise-router";

import { OsuOAuthRouter } from "./osu/index";
import { DiscordOAuthRouter } from "./discord/index";
import { isAuthenticated } from "../../../middlewares";
import { Logger } from "../../../util/logger";

export class OAuthRouter {
    public readonly router = promiseRouter();

    constructor() {
        const logger = Logger.get("OAuthRouter")

        this.router.use("/osu", (new OsuOAuthRouter).router)
        this.router.use("/discord", (new DiscordOAuthRouter).router)

        this.router.get("/logout", isAuthenticated, (req, res) => {
            req.session.destroy((err) => {
                if (err) {
                    logger.error(err);
                }
            });
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            req.logOut({}, () => {});
            res.json({ error: false });
        });
    }
}