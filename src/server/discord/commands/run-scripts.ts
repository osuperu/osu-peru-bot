import { readdirSync } from "fs";
import { resolve, extname } from "path";
import { App } from "../../app";
import { SlashCommand, SlashCommandReturn } from "../models/slash-command";

export default <SlashCommand>{
	commandEnum: "RUNSCRIPT",
	name: "runscript",
	description: "Ejecute scripts manualmente.",
	options: [
		{
			name: "script",
			description: "Nombre del script a ejecutar",
			type: "STRING",
			required: true,
			choices: readdirSync(resolve(__dirname, "../../scripts"))
				.filter((f) => extname(f) === ".js")
				.map((f) => ({
					name: f.split(".")[0],
					value: f.split(".")[0],
				})),
		},
	],
	async call({ interaction }): Promise<SlashCommandReturn> {
		const scriptName = interaction.options.get("script").value.toString();
		return {
			message: {
				content: App.instance.cron.runScriptManually(scriptName),
			},
		};
	},
};
