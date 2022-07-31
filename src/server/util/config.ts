import * as fs from "fs";
import _ from "lodash";

import { Settings } from "luxon";

export class Config {
	public http = {
		host: "127.0.0.1" as string,
		port: 5000 as number,
		publicUrl: "" as string,
	};

	public locale = {
		default: "es" as string,
		fallback: "es" as string,
	};

	public osu = {
		oauth: {
			clientID: "" as string,
			clientSecret: "" as string,
		},
	};

	public qat = {
		api: {
			username: "" as string,
			secret: "" as string,
		},
	};

	public discord = {
		oauth: {
			clientID: "" as string,
			clientSecret: "" as string,
		},
		token: "" as string,
		guildID: "" as string,
		logChannel: "" as string,
		roles: {
			verifiedRole: "" as string,
			groupRoles: {
				gmt: "" as string,
				bng: "" as string,
				nat: "" as string,
				alumni: "" as string,
			},
			playModeRoles: {
				osu: "" as string,
				mania: "" as string,
				taiko: "" as string,
				fruits: "" as string,
			},
			rankedMapper: "" as string,
			isRestricted: "" as string,
			foreigner: "" as string,
		},
		tracking: {
			mapping: "" as string,
		},
		eventHandlers: {
			channels: {
				mappingTimestamp: [""] as string[],
			},
		},
		emojis: {
			gamemodes: {
				osu: "" as string,
				mania: "" as string,
				taiko: "" as string,
				fruits: "" as string,
			},
			difficulties: {
				easy: {
					name: "" as string,
					id: "" as string,
				},
				normal: {
					name: "" as string,
					id: "" as string,
				},
				hard: {
					name: "" as string,
					id: "" as string,
				},
				insane: {
					name: "" as string,
					id: "" as string,
				},
				expert: {
					name: "" as string,
					id: "" as string,
				},
				expertPlus: {
					name: "" as string,
					id: "" as string,
				},
			},
		},
	};

	public mongo = {
		uri: "" as string,
		backupDir: "./data/backups" as string,
	};

	public misc = {
		timezone: "America/Lima" as string,
		defaultCountryCode: "PE" as string,
		cooldownDuration: 86400000 as number,
	};

	public logs = {
		color: {
			info: "17A2B8" as string,
			success: "28A745" as string,
			warn: "FFC107" as string,
			error: "DC3545" as string,
		},
	};

	public session = {
		secret: "" as string,
	};

	constructor() {
		this.load();
	}

	public load(configPath = "config.json"): void {
		this.parse(
			fs.readFileSync(configPath).toString(),
			fs.readFileSync("config.default.json").toString()
		);
	}

	public parse(content: string, defaultContent: string): void {
		const contentJSON = JSON.parse(content);
		const defaultContentJSON = JSON.parse(defaultContent);
		const configObj = _.defaultsDeep(contentJSON, defaultContentJSON);

		Object.entries(configObj).forEach(([key, value]) => {
			this[key] = value;
		});

		Settings.defaultZone = this.misc.timezone;
	}
}
