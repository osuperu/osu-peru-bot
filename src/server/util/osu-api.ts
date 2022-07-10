import axios from "axios";

import { CodeExchangeSchema } from "../models/schemas/osu-api-info-schema";
import { Misc } from "../util/misc"
import { DateTime } from "luxon";

import { App } from "../app";

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

	static async request({endpoint, accessToken}: {endpoint: string; accessToken?: string;}): Promise<unknown> {
		const response = await axios(endpoint, {
			baseURL: "https://osu.ppy.sh/api/v2",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		return response.data;
	}

    static async refreshClientCredential(): Promise<void> {
        if(Math.abs(App.instance.clientCredential.lastFetched.diffNow("days").days) < 0.95) return;
        const response = (await axios.post<CodeExchangeSchema>("https://osu.ppy.sh/oauth/token", {
            grant_type: 'client_credentials',
            scope: "public",
            client_id: App.instance.config.osu.oauth.clientID,
            client_secret: App.instance.config.osu.oauth.clientSecret,
        })).data;

        App.instance.clientCredential = {
            token: response.access_token,
            lastFetched: DateTime.now().setZone(App.instance.config.misc.timezone),
        };
    }

	static async fetchUser(user?: string, accessToken?: string, gameMode?: string): Promise<unknown> {
        return await this.request({
            endpoint: `${user ? `/users/${user}` : "/me"}${gameMode ? `/${gameMode}` : ""}`,
            accessToken,
        });
    }

	static async fetchUserPublic(userid: string, gamemode: "osu" | "mania" | "fruits" | "taiko"): Promise<unknown> {
        await this.refreshClientCredential();
		return this.request({
			endpoint: `/users/${userid}/${gamemode}${
				Misc.isNumeric(userid) ? "" : "?key=username"
			}`,
			accessToken: App.instance.clientCredential.token,
		});
    }
}

