// priority: 1000

type SpliceAction = "splice" | "break" | "continue" | void;

class ArrayHelper {

	public static random<T>(array: T[]): T {
		if (array.length === 0) throw new Error("Cannot choose from an empty array");

		return array[Math.floor(Math.random() * array.length)];
	}

	/**
	 * Creates a shallow clone of the array and shuffles it
	 */
	public static shuffle<T>(array: T[]): T[] {
		const copy = array.slice();
		for (let i = copy.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[copy[i], copy[j]] = [copy[j], copy[i]];
		}
		return copy;
	}

	public static getByComparison<T>(array: T[], scoreGetter: (x: T) => number, comparison: (a: number, b: number) => number): T {
		if (array.length === 0) throw new Error("Cannot get the best element from an empty array");

		let best = array[0];
		let bestScore = scoreGetter(best);

		for (let i = 1; i < array.length; i++) {
			const item = array[i];
			const score = scoreGetter(item);
			if (comparison(score, bestScore) > 0) {
				best = item;
				bestScore = score;
			}
		}

		return best;
	}

	public static getHighest<T>(array: T[], scoreGetter: (x: T) => number): T {
		return this.getByComparison(array, scoreGetter, (a, b) => a - b);
	}

	public static getLowest<T>(array: T[], scoreGetter: (x: T) => number): T {
		return this.getByComparison(array, scoreGetter, (a, b) => b - a);
	}


	public static forEachRight<T>(array: T[], callback: (item: T, index: number, arr: T[]) => SpliceAction): void {
		for (let i = array.length - 1; i >= 0; i--) {
			const action = callback(array[i], i, array);
			if (action === "splice") array.splice(i, 1);
			else if (action === "break") return;
		}
	}
}