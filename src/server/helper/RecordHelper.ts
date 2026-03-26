// priority: 1000

namespace RecordHelper {

	export function getOrCreate<T>(record: Record<string, T>, id: string): T {
		return record[id] ??= {} as T;
	}
}