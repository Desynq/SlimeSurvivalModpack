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