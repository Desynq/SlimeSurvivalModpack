// priority: 9000

function hasNoNull<T extends object>(
	obj: T
): obj is { [K in keyof T]: Exclude<T[K], null> } {

	return !Object.values(obj).some(v => v === null);
}