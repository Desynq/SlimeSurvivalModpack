// priority: 1000

type SpliceAction = "splice" | "break" | "continue" | void;

class ArrayHelper {

	public static random<T>(array: T[]): T {
		if (array.length === 0) throw new Error("Cannot choose from an empty array");

		return array[Math.floor(Math.random() * array.length)];
	}

	public static shuffle<T>(array: T[]): void {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
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

	/**
	 * Forward traverse with splicing occuring as a batch after traversal.
	 * 
	 * Use as a snapshot since elements are marked for deletion during traversal and only deleted after traversal is finished.
	 * 
	 * Early returns if `array.length === 0` so there's no major performance penalty in passing an empty array.
	 * 
	 * Avoid passing in an array with `null` values as they might unintentionally get pruned.
	 */
	public static forEachDeferredSplice<T>(
		array: T[],
		callback: (item: T, index: number, arr: T[]) => SpliceAction
	): void {
		if (array.length === 0) return;

		const removeIndices: number[] = [];

		for (let i = 0; i < array.length; i++) {
			const action = callback(array[i], i, array);
			if (action === "splice") {
				removeIndices.push(i);
			}
			else if (action === "break") {
				break;
			}
		}

		for (const i of removeIndices) {
			array[i] = null as any;
		}
		if (removeIndices.length > 0) {
			let write = 0;
			for (let read = 0; read < array.length; read++) {
				if (array[read] != null) array[write++] = array[read];
			}
			array.length = write;
		}
	}
}