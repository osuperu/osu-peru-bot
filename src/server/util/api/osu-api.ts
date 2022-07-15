import axios from "axios";

import { OCodeExchange } from "../../models/osu-api/oauth-access";
import { OGamemodeName } from "../../models/osu-api/gamemode";
import { Misc } from "../misc";
import { DateTime } from "luxon";

import { App } from "../../app";

export class OsuApi {
	static async refreshAccessToken(refresh_token: string): Promise<unknown> {
		return (
			await axios({
				method: "post",
				url: "https://osu.ppy.sh/oauth/token",
				data: {
					grant_type: "refresh_token",
					refresh_token,
					client_id: App.instance.config.osu.oauth.clientID,
					client_secret: App.instance.config.osu.oauth.clientSecret,
				},
			})
		).data;
	}

	static async request({
		endpoint,
		accessToken,
	}: {
		endpoint: string;
		accessToken?: string;
	}): Promise<unknown> {
		const response = await axios(endpoint, {
			baseURL: "https://osu.ppy.sh/api/v2",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		return response.data;
	}

	static async refreshClientCredential(): Promise<void> {
		if (
			Math.abs(
				App.instance.clientCredential.lastFetched.diffNow("days").days
			) < 0.95
		)
			return;
		const response = (
			await axios.post<OCodeExchange>("https://osu.ppy.sh/oauth/token", {
				grant_type: "client_credentials",
				scope: "public",
				client_id: App.instance.config.osu.oauth.clientID,
				client_secret: App.instance.config.osu.oauth.clientSecret,
			})
		).data;

		App.instance.clientCredential = {
			token: response.access_token,
			lastFetched: DateTime.now().setZone(
				App.instance.config.misc.timezone
			),
		};
	}

	static async fetchUser(
		user?: string,
		accessToken?: string,
		gamemode?: OGamemodeName
	): Promise<unknown> {
		return await this.request({
			endpoint: `${user ? `/users/${user}` : "/me"}${
				gamemode ? `/${gamemode}` : ""
			}`,
			accessToken,
		});
	}

	static async fetchUserPublic(
		userID: string,
		gamemode: OGamemodeName
	): Promise<unknown> {
		await this.refreshClientCredential();
		return this.request({
			endpoint: `/users/${userID}/${gamemode}${
				Misc.isNumeric(userID) ? "" : "?key=username"
			}`,
			accessToken: App.instance.clientCredential.token,
		});
	}

	static async fetchUserRecentPlay(
		userid: number,
		gamemode: OGamemodeName,
		limit: number,
		offset: number,
		includeFails: "0" | "1"
	): Promise<unknown> {
		await this.refreshClientCredential();
		return this.request({
			endpoint: `/users/${userid}/scores/recent?include_fails=${includeFails}&mode=${gamemode}&limit=${limit}&offset=${offset}`,
			accessToken: App.instance.clientCredential.token,
		});
	}

	static async fetchUserTopPlays(
		userid: number,
		gamemode: OGamemodeName,
		limit: number,
		offset: number
	): Promise<unknown> {
		await this.refreshClientCredential();
		return this.request({
			endpoint: `/users/${userid}/scores/best?mode=${gamemode}&limit=${limit}&offset=${offset}`,
			accessToken: App.instance.clientCredential.token,
		});
	}

	static async fetchUserBeatmapScores(
		beatmapID: number,
		userID: number,
		gamemode?: OGamemodeName
	): Promise<unknown> {
		await this.refreshClientCredential();
		return this.request({
			endpoint: `/beatmaps/${beatmapID}/scores/users/${userID}/all?mode=${gamemode}`,
			accessToken: App.instance.clientCredential.token,
		});
	}

	static async fetchBeatmap(beatmapID: number): Promise<unknown> {
		await this.refreshClientCredential();
		return this.request({
			endpoint: `/beatmaps/${beatmapID}`,
			accessToken: App.instance.clientCredential.token,
		});
	}

	static async fetchBeatmaps(...beatmaps: number[]): Promise<unknown> {
		await this.refreshClientCredential();
		let queryParameter = `?ids[]=${beatmaps[0]}`;
		if (beatmaps.length > 1) {
			for (let i = 0; i < beatmaps.length; i++) {
				if (i > 0) {
					queryParameter += `&ids[]=${beatmaps[i]}`;
				}
			}
		}
		return this.request({
			endpoint: `/beatmaps${queryParameter}`,
			accessToken: App.instance.clientCredential.token,
		});
	}
}
