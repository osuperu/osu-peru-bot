import { OGamemodeName } from "../models/osu-api/gamemode";
import { Calculator } from "../models/calculator";
import { OsuCalculator } from "./osu-performance/osu-calculator";
import { TaikoCalculator } from "./osu-performance/taiko-calculator";
import { FruitsCalculator } from "./osu-performance/fruits-calculator";
import { ManiaCalculator } from "./osu-performance/mania-calculator";

export class PerformanceFactory {
	public getCalculator(gamemode: OGamemodeName): Calculator {
		switch (gamemode) {
			case "osu": {
				return new OsuCalculator();
			}
			case "taiko": {
				return new TaikoCalculator();
			}
			case "fruits": {
				return new FruitsCalculator();
			}
			case "mania": {
				return new ManiaCalculator();
			}
		}
	}
}
