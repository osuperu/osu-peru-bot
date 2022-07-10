import promiseRouter from "express-promise-router";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import { DateTime } from "luxon";

import { App } from "../../app";

import DiscordStrategy from "passport-discord";
import OsuStrategy from "passport-osu";

import { isDatabaseAvailable } from "../../middlewares";

import { AppRequest } from "../../models/app-request";
import { User, DiscordInformation } from "../../models/user";

import { OAuthRouter } from "./oauth/index";
import { UserRouter } from "./user/index";

import { Logger } from "../../util/logger";
import { ErrorCode } from "../../util/error-codes";

export class ApiRouter {
	public readonly router = promiseRouter();

	constructor() {
		this.router.use(
			"/",
			isDatabaseAvailable,
			(req: AppRequest, res, next) => {
				req.api = true;
				next();
			}
		);

		this.router.use(
			session({
				secret: App.instance.config.session.secret,
				store: MongoStore.create({
					mongoUrl: App.instance.config.mongo.uri,
				}),
				cookie: {
					maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
				},
				saveUninitialized: false,
				resave: false,
			})
		);

		const passportLogger = Logger.get("passport");

		passport.use(
			"discord",
			new DiscordStrategy(
				{
					clientID: App.instance.config.discord.oauth.clientID,
					clientSecret:
						App.instance.config.discord.oauth.clientSecret,
					callbackURL:
						App.instance.config.http.publicUrl +
						"/api/auth/discord/callback",
					passReqToCallback: true,
				},
				async (
					req: AppRequest,
					accessToken,
					refreshToken,
					profile,
					done
				) => {
					if (req.user) {
						try {
							if (!req.user.discord) {
								req.user.discord = {} as DiscordInformation;
								req.user.discord.userID = profile.id;
							}

							if (req.user.discord.userID !== profile.id) {
								passportLogger.warn(
									`User **[${req.user.getUsername()}](https://osu.ppy.sh/users/${
										req.user.osu.userID
									})** tried to reclaim another Discord account (ID: \`${
										profile.id
									}\`, Name: \`${profile.username}#${
										profile.discriminator
									}\`)`
								);
								done(ErrorCode.ALREADY_AUTHENTICATED as Error);
							} else {
								req.user.discord.userNameWithDiscriminator = `${profile.username}#${profile.discriminator}`;
								req.user.discord.accessToken = accessToken;
								req.user.discord.refreshToken = refreshToken;
								await req.user.save();
								done(null, req.user);
							}
						} catch (error) {
							passportLogger.error(
								"Error while authenticating user via Discord",
								{ error }
							);
							done(error);
						}
					}
				}
			)
		);

		passport.use(
			"osu",
			new OsuStrategy(
				{
					type: "StrategyOptions",
					clientID: App.instance.config.osu.oauth.clientID,
					clientSecret: App.instance.config.osu.oauth.clientSecret,
					callbackURL:
						App.instance.config.http.publicUrl +
						"/api/auth/osu/callback",
				},
				async (accessToken, refreshToken, profile, done) => {
					try {
						let user = await User.findOne({
							"osu.userID": profile.id,
						});
						if (user) {
							user.lastLogin = DateTime.now()
								.setZone(App.instance.config.misc.timezone)
								.toJSDate();
						} else {
							user = new User({
								osu: {
									userID: profile.id,
									lastVerified: DateTime.now()
										.setZone(
											App.instance.config.misc.timezone
										)
										.toJSDate(),
								},
							});
						}

						user.osu.playmode = profile._json.playmode;
						user.osu.username = profile._json.username;
						user.osu.country_code = profile._json.country_code;

						user.osu.accessToken = accessToken;
						user.osu.refreshToken = refreshToken;
						await user.save();
						done(null, user);
					} catch (error) {
						passportLogger.error(
							"Error while authenticating user via osu!",
							{ error }
						);
						done(error);
					}
				}
			)
		);

		passport.serializeUser(User.serializeUser);
		passport.deserializeUser(User.deserializeUser);
		this.router.use(passport.initialize());
		this.router.use(passport.session());

		this.router.use("/auth", (new OAuthRouter).router);
		this.router.use("/user", new UserRouter().router);

		this.router.use("*", (req, res) => {
			res.status(404).json({ error: ErrorCode.NOT_FOUND });
		});
	}
}
