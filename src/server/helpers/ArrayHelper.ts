


class ArrayHelper {

	public static random<T>(array: T[]): T {
		if (array.length === 0) throw new Error("Cannot choose from empty array");

		return array[Math.floor(Math.random() * array.length)];
	}
}