import { MessageEmbed, MessageOptions } from "discord.js";
import { CommandResponse } from "../../models/command-response";
import { OGamemodeName } from "../../models/osu-api/gamemode";
import { QatUser } from "../../models/qat-api/qat";

export class OpenBNsResponse implements CommandResponse {
	async getMessage(
		qatAllUsers: QatUser[],
		gamemode: OGamemodeName
	): Promise<MessageOptions> {
		const openBNs: QatUser[] = [];

		qatAllUsers.forEach((user: QatUser) => {
			if (
				!user.requestStatus.includes("closed") &&
				user.requestStatus.length > 0
			) {
				openBNs.push(user);
			}
		});

		const embed = new MessageEmbed().setColor("#27b6b3");

		if (gamemode) {
			embed
				.setAuthor({
					name: `${
						this.getOpenBNsPerMode(openBNs, gamemode, "link").split(
							"\n"
						).length
					} BNs de ${gamemode} disponibles`,
					url: `https://bn.mappersguild.com/`,
					iconURL: "https://bn.mappersguild.com/images/qatlogo.png",
				})
				.setDescription(
					`${this.getOpenBNsPerMode(openBNs, gamemode, "status")}`
				)
				.setFooter({
					text: `Usa "/open-bns" para ver todos los BNs disponibles.`,
				});
		} else {
			embed
				.setAuthor({
					name: `${openBNs.length} BNs disponibles`,
					url: "https://bn.mappersguild.com/",
					iconURL: "https://bn.mappersguild.com/images/qatlogo.png",
				})
				.addField(
					"osu",
					`${this.getOpenBNsPerMode(openBNs, "osu", "link")}`,
					true
				)
				.addField(
					"taiko",
					`${this.getOpenBNsPerMode(openBNs, "taiko", "link")}`,
					true
				)
				.addField(
					"mania",
					`${this.getOpenBNsPerMode(openBNs, "mania", "link")}`,
					true
				)
				.addField(
					"catch",
					`${this.getOpenBNsPerMode(openBNs, "catch", "link")}`,
					true
				)
				.setFooter({
					text: `Usa "/openbns <modo de juego>" para ver mas detalles.`,
				});
		}

		return {
			embeds: [embed],
		};
	}

	private getOpenBNsPerMode(
		openBNs: QatUser[],
		gamemode: OGamemodeName,
		type: string
	): string {
		const bns = [];
		for (const openBN of openBNs) {
			if (openBN.modesInfo.find((m) => m.mode === gamemode)) {
				switch (type) {
					case "link":
						bns.push(
							`[${openBN.username}](https://osu.ppy.sh/users/${openBN.osuId})`
						);
						break;
					case "status":
						bns.push(
							`**[${openBN.username}](https://osu.ppy.sh/users/${
								openBN.osuId
							})** (${this.getRequestStatus(openBN)})`
						);
						break;
					default:
						break;
				}
			}
		}

		return bns.sort().join("\n");
	}

	private getRequestStatus(user: QatUser): string {
		let requestStatus = user.requestStatus;

		requestStatus = requestStatus.filter((status) => status !== "closed");

		return requestStatus
			.join(", ")
			.replace(
				"personalQueue",
				`${
					user.requestLink
						? `[cola personal](${user.requestLink})`
						: `cola personal (sin link)`
				}`
			)
			.replace(
				"globalQueue",
				"[cola global](https://bn.mappersguild.com/modrequests/listing)"
			)
			.replace("gameChat", "chat del juego");
	}
}
