import Mongoose from "mongoose";
import { DateTime } from "luxon";

import { App } from "../app";

import { OsuApi } from "../util/api/osu-api";
import { DiscordAPIError, RoleResolvable, Snowflake } from "discord.js";

import { OsuInformationSchema } from "./mongo-schemas/osu-info-schema";
import { OCodeExchange } from "./osu-api/oauth-access";
import { OUser } from "./osu-api/user"
import { DiscordInformationSchema } from "./mongo-schemas/discord-info-schema";
import { UserSchema } from "./mongo-schemas/user-schema";
import { TrackingSchema } from "./mongo-schemas/tracking-schema";

import { Logger } from "../util/logger";
import { EventSchema } from './mongo-schemas/event-schema';
const logger = Logger.get("UserModel");

export interface OsuInformation extends Mongoose.Types.Subdocument {
	userID: number;
	playmode: string;
	groups: string[];
	isRankedMapper: boolean;
	username: string;
	country_code: string;
	isRestricted: boolean;
	accessToken: string;
	refreshToken: string;
	dateAdded: Date;
	lastVerified: Date;

	fetchUser(): Promise<void>;
}

export interface DiscordInformation extends Mongoose.Types.Subdocument {
	userID: string;
	userNameWithDiscriminator: string;
	accessToken: string;
	refreshToken: string;
	dateAdded: Date;
	lastUpdated: Date;

	updateUser(): Promise<void>;
	delink(): Promise<void>;
	availableDelinkDate(): DateTime | false;
}

export interface UserInformation {
	id: string;
	lastLogin: Date;
	avatar_url: string;
	osuID?: number;
	username?: string;
	discordID?: string;
	discordName?: string;
	osuLinked: boolean;
	discordLinked: boolean;
	remainingDelinkTime?: number;
}

export interface VotingUserInformation {
	userID: number;
	voters: number[];
}

export interface User extends Mongoose.Document {
	registration: Date;
	lastLogin: Date;
	discord?: DiscordInformation;
	osu?: OsuInformation;

	getInfos(): UserInformation;
	updateUser(): Promise<void>;
	getUsername(): string;
}

export interface UserMappingTrack extends Mongoose.Document {
	userID: number;
	lastUpdated: Date;
}

export interface Event extends Mongoose.Document {
	startDate: Date;
	endDate: Date;
	title: string;
	competitors?: VotingUserInformation[];
	participants?: VotingUserInformation[];

	isVoted(): boolean;
	isActive(): boolean;
}

export interface UserModel extends Mongoose.Model<User> {
	serializeUser: (
		user: User,
		done: (error: Error, number: number) => void
	) => void;
	deserializeUser: (
		id: number,
		done: (error: Error, user: User) => void
	) => void;
	byOsuResolvable: (osuresolvable: string) => Promise<User>;
}

OsuInformationSchema.methods.fetchUser = async function (
	this: OsuInformation
): Promise<void> {
	if (-DateTime.fromJSDate(this.lastVerified).diffNow("days").days >= 0.95) {
		// Expires after one day
		try {
			const tokenRet = (await OsuApi.refreshAccessToken(
				this.refreshToken
			)) as OCodeExchange;
			this.accessToken = tokenRet.access_token;
			this.refreshToken = tokenRet.refresh_token;
			this.lastVerified = DateTime.now().toJSDate();
		} catch (err) {
			if (err.response.status == 401) {
				const username = this.username;
				const userID = this.userID;
				logger.warn(
					`Found [${username}](https://osu.ppy.sh/users/${userID}) revoked permissions for osu! application. Removing their account.`,
					err
				);
				await (this.ownerDocument() as User).discord.delink();
				await (this.ownerDocument() as Mongoose.Document).remove();
				throw `Removed [${username}](https://osu.ppy.sh/users/${userID}) 's account.`;
			} else {
				logger.error(
					`Failed to obtain new access token from user [${this.username}](https://osu.ppy.sh/users/${this.userID})`,
					err
				);
			}
			return;
		}
	}
	const ret = (await OsuApi.fetchUser(
		undefined,
		this.accessToken,
		undefined
	)) as OUser;

	this.isRestricted = ret.is_restricted;
	this.username = ret.username;
	this.playmode = ret.playmode;
	this.country_code = ret.country_code;
	this.groups = ret.groups.map((e) => e["identifier"]);
	this.isRankedMapper = ret.ranked_beatmapset_count > 0;
	await (this.ownerDocument() as Mongoose.Document).save();
};

DiscordInformationSchema.methods.updateUser = async function (
	this: DiscordInformation
): Promise<void> {
	const discordMember = await App.instance.discordClient.fetchMember(
		this.userID,
		true
	);

	if (discordMember) {
		const currentRoles = discordMember.roles.cache;
		const addArray: string[] = [],
			removeArray: string[] = [];

		Object.keys(App.instance.config.discord.roles.groupRoles).forEach(
			async (group) => {
				if ((this.ownerDocument() as User).osu?.groups.includes(group))
					addArray.push(
						App.instance.config.discord.roles.groupRoles[group]
					);
				else
					removeArray.push(
						App.instance.config.discord.roles.groupRoles[group]
					);
			}
		);

		Object.keys(App.instance.config.discord.roles.playModeRoles).forEach(
			async (playmode) => {
				if ((this.ownerDocument() as User).osu?.playmode == playmode)
					addArray.push(
						App.instance.config.discord.roles.playModeRoles[
						playmode
						]
					);
				else
					removeArray.push(
						App.instance.config.discord.roles.playModeRoles[
						playmode
						]
					);
			}
		);

		if ((this.ownerDocument() as User).osu?.isRankedMapper)
			addArray.push(App.instance.config.discord.roles.rankedMapper);
		else removeArray.push(App.instance.config.discord.roles.rankedMapper);

		if ((this.ownerDocument() as User).osu?.isRestricted)
			addArray.push(App.instance.config.discord.roles.isRestricted);
		else removeArray.push(App.instance.config.discord.roles.isRestricted);

		if (
			(this.ownerDocument() as User).osu?.country_code !=
			App.instance.config.misc.defaultCountryCode
		)
			addArray.push(App.instance.config.discord.roles.foreigner);
		else removeArray.push(App.instance.config.discord.roles.foreigner);

		addArray.push(App.instance.config.discord.roles.verifiedRole);

		// In case of permission error during updating
		try {
			await discordMember.roles.remove(
				removeArray.filter((r) =>
					currentRoles.has(r as Snowflake)
				) as RoleResolvable[]
			);
			await discordMember.roles.add(
				addArray.filter(
					(r) => !currentRoles.has(r as Snowflake)
				) as RoleResolvable[]
			);

			await discordMember.setNickname(
				(this.ownerDocument() as User).getUsername()
			);
		} catch (err) {
			if (!(err instanceof DiscordAPIError && err.code === 50013)) {
				throw err;
			}
		}

		this.lastUpdated = DateTime.now().toJSDate();
		await (this.ownerDocument() as Mongoose.Document).save();
	}
};

DiscordInformationSchema.methods.delink = async function (
	this: DiscordInformation
): Promise<void> {
	const discordMember = await App.instance.discordClient.fetchMember(
		this.userID,
		true
	);

	if (discordMember) {
		const currentRoles = discordMember.roles.cache;

		const removeArray = [
			App.instance.config.discord.roles.verifiedRole,
			App.instance.config.discord.roles.rankedMapper,
			App.instance.config.discord.roles.isRestricted,
			App.instance.config.discord.roles.foreigner,
		];

		Object.keys(App.instance.config.discord.roles.groupRoles).forEach(
			async (group) => {
				removeArray.push(
					App.instance.config.discord.roles.groupRoles[group]
				);
			}
		);
		Object.keys(App.instance.config.discord.roles.playModeRoles).forEach(
			async (playmode) => {
				removeArray.push(
					App.instance.config.discord.roles.playModeRoles[playmode]
				);
			}
		);

		// In case of permission error during updating
		try {
			await discordMember.roles.remove(
				removeArray.filter((r) =>
					currentRoles.has(r as Snowflake)
				) as RoleResolvable[]
			);
			await discordMember.setNickname("");
		} catch (err) {
			if (!(err instanceof DiscordAPIError && err.code === 50013)) {
				throw err;
			}
		}

		logger.log(
			"error",
			`**[${(
				this.ownerDocument() as User
			).getUsername()}](https://osu.ppy.sh/users/${(this.ownerDocument() as User).osu.userID
			})** \`Discord ID: ${this.userID
			}\` has **delinked** their Discord account.`
		);
		this.lastUpdated = DateTime.now().toJSDate();
		await (this.ownerDocument() as Mongoose.Document).save();
	}
};

DiscordInformationSchema.methods.availableDelinkDate = function (
	this: DiscordInformation
): DateTime | false {
	const availableDelinkDate = DateTime.fromJSDate(this.dateAdded).plus(
		App.instance.config.misc.cooldownDuration
	);

	if (availableDelinkDate.diffNow().as("milliseconds") >= 0) {
		return availableDelinkDate;
	} else {
		return false;
	}
};

UserSchema.statics.serializeUser = function (user: User, done) {
	done(null, user && user.id ? user.id : null);
};

UserSchema.statics.deserializeUser = async function (id: string, done) {
	try {
		let user = null;
		if (id) user = await User.findById(id);
		done(null, user);
	} catch (error) {
		logger.error("Error while deserializing user", { error });
		done(error, null);
	}
};

UserSchema.statics.byOsuResolvable = async function (
	osuresolvable: string
): Promise<User> {
	return isNaN(Number(osuresolvable))
		? await this.findOne({ "osu.username": osuresolvable })
		: await this.findOne({ "osu.userID": osuresolvable });
};

UserSchema.methods.getInfos = function (this: User): UserInformation {
	const userObj: UserInformation = {
		id: this.id,
		lastLogin: this.lastLogin,
		avatar_url: `https://a.ppy.sh/${this.osu?.userID}?${Date.now()}`,
		osuID: this.osu ? this.osu.userID : undefined,
		username: this.osu ? this.osu.username : undefined,
		discordID: this.discord ? this.discord.userID : undefined,
		discordName: this.discord
			? this.discord.userNameWithDiscriminator
			: undefined,
		osuLinked: this.osu != null,
		discordLinked: this.discord != null,
	};

	if (this.discord != null) {
		const availableDelinkDate = this.discord.availableDelinkDate();
		if (availableDelinkDate !== false) {
			userObj.remainingDelinkTime = availableDelinkDate
				.diffNow()
				.as("milliseconds");
		}
	}

	return userObj;
};

UserSchema.methods.updateUser = async function (this: User): Promise<void> {
	try {
		await this.osu?.fetchUser();
		await this.discord?.updateUser();
		return;
	} catch (err) {
		logger.error(err);
	}
};

UserSchema.methods.getUsername = function (this: User): string {
	if (this.osu && this.osu.username) {
		return this.osu.username;
	} else if (this.discord && this.discord.userNameWithDiscriminator) {
		return this.discord.userNameWithDiscriminator;
	} else {
		return "Unknown"; // ¿Por modificar?
	}
};

EventSchema.methods.isVoted = function (this: Event): boolean {
	for (const competitor of this.competitors) {
		if (competitor.userID){
			return true;
		}
	}
	return false;
}

EventSchema.methods.isActive = function (this: Event): boolean {
	const currentDate = DateTime.now().toJSDate();
	if (this.startDate <= currentDate && currentDate <= this.endDate) {
		return true;
	} else {
		return false;
	}
}

export const User: UserModel = Mongoose.model<User>(
	"User",
	UserSchema
) as UserModel;

export const UserMappingTrack = Mongoose.model(
	"UserMappingTrack",
	TrackingSchema
);