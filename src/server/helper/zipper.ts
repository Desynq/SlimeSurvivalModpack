// priority: 1000

function zipRecord<
	T extends Record<string, readonly any[]>,
	R
>(
	record: T,
	fn: (values: {
		[K in keyof T]: T[K] extends readonly (infer U)[] ? U : never
	}) => R
): R[] {
	const length = Object.values(record)[0].length;
	const result: R[] = [];

	for (let i = 0; i < length; i++) {
		const row: any = {};

		for (const key in record) {
			row[key] = record[key][i];
		}

		result.push(fn(row));
	}

	return result;
}