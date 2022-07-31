import promiseRouter from "express-promise-router";
import passport from "passport";
import { DiscordAPIError, RoleResolvable, Snowflake } from "discord.js";

import { Logger } from "../../../../util/logger";
import { App } from "../../../../app";
import { isDatabaseAvailable, isAuthenticated, discordAlreadyLinked } from "../../../../middlewares";
import { ErrorCode } from "../../../../util/error-codes";
import { AppRequest } from "../../../../models/app-request";

const logger = Logger.get("OAuthDiscordRouter");

export class DiscordOAuthRouter {
	public readonly router = promiseRouter();

	constructor() {
		this.router.get(
			"/",
			isDatabaseAvailable,
			isAuthenticated,
			passport.authenticate("discord", {
				scope: ["identify", "guilds.join"],
			})
		);

		this.router.get(
			"/callback",
			isDatabaseAvailable,
			isAuthenticated,
			discordAlreadyLinked,
			passport.authenticate("discord", { failureRedirect: "/" }),
			async (req: AppRequest, res) => {
				const discordMember =
					await App.instance.discordClient.fetchMember(
						req.user.discord?.userID,
						true
					);

				if (!discordMember) {
					try {
						await App.instance.discordClient.discordGuild?.members.add(
							req.user.discord?.userID as Snowflake,
							{
								accessToken: req.user.discord?.accessToken,
								nick: req.user.osu?.username,
								roles: [
									App.instance.config.discord.roles
										.verifiedRole as RoleResolvable,
								],
							}
						);
					} catch (err) {
						if (
							err instanceof DiscordAPIError &&
							err.code === 40007
						)
							throw ErrorCode.BANNED;
						else if (
							!(
								err instanceof DiscordAPIError &&
								err.code === 30001
							)
						)
							throw err;
					}
				}

				await req.user.osu?.fetchUser();
				await req.user.discord?.updateUser();
				logger.log(
					"success",
					`**[${req.user.getUsername()}](https://osu.ppy.sh/users/${
						req.user.osu.userID
					})** \`Discord ID: ${
						req.user.discord.userID
					}\` has **linked** their Discord account.`
				);
				res.redirect("/");
			}
		);

		this.router.get(
			"/delink",
			isDatabaseAvailable,
			isAuthenticated,
			async (req: AppRequest, res) => {
				if (
					req.user?.discord &&
					!req.user.discord.availableDelinkDate()
				) {
					await req.user.discord.delink();
					req.user.discord = undefined;
					await req.user.save();
					return res.json({ error: false });
				} else {
					throw ErrorCode.FORBIDDEN;
				}
			}
		);
	}
}
