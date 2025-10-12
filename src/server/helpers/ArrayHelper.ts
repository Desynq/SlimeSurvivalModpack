


class ArrayHelper {

	public static random<T>(array: T[]): T {
		if (array.length === 0) throw new Error("Cannot choose from an empty array");

		return array[Math.floor(Math.random() * array.length)];
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
}