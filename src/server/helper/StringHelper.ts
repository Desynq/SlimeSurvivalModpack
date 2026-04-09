// priority: 1000

namespace StringHelper {

	export function capitalize(string: string): string {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	export function toRoman(number: number): string {
		const romans: [string, number][] = [
			["M", 1000], ["CM", 900], ["D", 500], ["CD", 400], ["C", 100], ["XC", 90],
			["L", 50], ["XL", 40], ["X", 10], ["IX", 9], ["V", 5], ["IV", 4], ["I", 1]
		];
		let result = "";
		for (let i = 0; i < romans.length; i++) {
			while (number >= romans[i][1]) {
				result += romans[i][0];
				number -= romans[i][1];
			}
		}
		return result;
	}

	/**
	 * @example toPercent(0.50123, 2) -> 50.12
	 */
	export function toPercent(number: number, decimals: number): string {
		if (decimals < 0) throw new Error(`toPercent decimals must be >= 0. decimals = ${decimals}`);

		return (number * 100).toFixed(decimals);
	}

	export function upToFixed(x: number, decimals: number): string {
		if (decimals < 0) throw new Error(`upToFixed decimals must be >= 0. decimals = ${decimals}`);

		const factor = 10 ** decimals;
		const rounded = Math.round(x * factor) / factor;

		return rounded.toFixed(decimals).replace(/\.?0+$/, "");
	}

	/**
	 * @example toSeconds(20) -> "1 second"
	 * @example toSeconds(30) -> "2.5 seconds"
	 */
	export function toSeconds(ticks: integer): string {
		const seconds = ticks / 20;
		return `${upToFixed(seconds, 2)} second${seconds === 1 ? "" : "s"}`;
	}

	export function formatUnit(value: number, unit: string, decimals: integer = 2): string {
		return `${upToFixed(value, decimals)} ${unit}${value === 1 ? "" : "s"}`;
	}




	export function wrapIfNeeded(input: string): string {
		const str = input.trim();
		if (str.length >= 2) {
			const first = str[0];
			const last = str[str.length - 1];
			const pairs: Record<string, string> = { '"': '"', '[': ']', '{': '}' };
			if (pairs[first] && last === pairs[first]) {
				return input; // already wrapped
			}
		}
		// Not wrapped: add quotes. Escape any existing " so the result is valid.
		const escaped = str.replace(/"/g, '\\"');
		return `"${escaped}"`;
	}

	export function sanitizeControlChars(text: string): string {
		return text
			.replace(/\r/g, "\n")
			.replace(/\t/g, "")
			.replace(/\n+/g, "\n");
	}



	export function needsStringify(value: any): boolean {
		if (value === null || value === undefined) return false;
		const type = typeof value;
		if (type !== "object") return false;

		if (typeof (value as any).toString === "function") {
			const str = value.toString();
			if (str !== "[object Object]") return false;
		}

		return true;
	}
}