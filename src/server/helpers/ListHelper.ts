
type SpliceAction = "splice" | "break" | "continue" | void;

class ListHelper {
	public static forEachRight<T>(array: T[], callback: (item: T, index: number, arr: T[]) => SpliceAction): void {
		for (let i = array.length - 1; i >= 0; i--) {
			const action = callback(array[i], i, array);
			if (action === "splice") array.splice(i, 1);
			else if (action === "break") return;
		}
	}
}