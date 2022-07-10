export class Misc {
	static secondsToHours(duration: number): number {
		return Math.trunc(duration / 3600);
	}

	static isNumeric(val: string): boolean {
		return val != null && val !== "" && !isNaN(Number(val.toString()));
	}
}
