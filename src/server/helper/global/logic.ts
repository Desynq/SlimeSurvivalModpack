// priority: 1000



function mapIfDefined<T, U>(value: T | undefined, consumer: (defined: T) => U): U | undefined {
	return value === undefined ? undefined : consumer(value);
}