namespace ObjectHelper {

	/**
	 * Ensures that the object's key is an array by assigning it an empty array if it isn't already assigned an array
	 */
	export function ensureArray(obj: Object, key: any) {
		if (!Array.isArray(obj[key])) {
			obj[key] = [];
		}
	};


	/**
	 * Returns the array at the given key, or creates an empty array if it doesn't exist.
	 */
	export function getOrCreateArray(obj: Object, key: string): any[] {
		ensureArray(obj, key);
		return obj[key];
	};


	export function isEmpty(obj: Object) {
		return Object.keys(obj).length === 0;
	};

	export function fromEntries<K extends string | number | symbol, V>(entries: [K, V][]) {
		const obj = {} as Record<K, V>;
		for (const [key, value] of entries) {
			obj[key] = value;
		}
		return obj;
	}
}