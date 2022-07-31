import axios from "axios";
import { App } from "../../app";

export class QatApi {
	static async request({ endpoint }: { endpoint: string }): Promise<unknown> {
		const response = await axios(endpoint, {
			baseURL: "https://bn.mappersguild.com/interOp",
			headers: {
				username: App.instance.config.qat.api.username,
				secret: App.instance.config.qat.api.secret,
			},
		});

		return response.data;
	}

	static async fetchUsers(userID?: number): Promise<unknown> {
		return this.request({
			endpoint: `/users/${userID ? userID : ``}`,
		});
	}

	static async fetchUserActivity(userID: number): Promise<unknown> {
		return this.request({
			endpoint: `/nominationResets/${userID}/90`,
		});
	}
}
