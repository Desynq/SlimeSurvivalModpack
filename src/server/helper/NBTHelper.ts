// priority: 1000

namespace NBTHelper {

	export function getOrNull<T>(tag: CompoundTag_, key: string, tagType: integer): T | null {
		if (!tag.contains(key, tagType)) return null;
		return tag.get(key, tagType);
	}

	export function getOrCreateCompound(tag: CompoundTag_, key: string, fallback: CompoundTag_ = new $CompoundTag()): CompoundTag_ {
		if (!tag.contains(key, $Tag.TAG_COMPOUND)) {
			tag.put(key, fallback);
			return fallback;
		}

		return tag.getCompound(key);
	}
}