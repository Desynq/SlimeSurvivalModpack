// priority: 1000

namespace NBTHelper {

	export function getLongOrNull(tag: CompoundTag_, key: string): long | null {
		if (!tag.contains(key, $Tag.TAG_LONG)) return null;
		return tag.getLong(key);
	}

	export function getIntOrNull(tag: CompoundTag_, key: string): integer | null {
		if (!tag.contains(key, $Tag.TAG_INT)) return null;
		return tag.getInt(key);
	}

	export function getStringOrNull(tag: CompoundTag_, key: string): string | null {
		if (!tag.contains(key, $Tag.TAG_STRING)) return null;
		return tag.getString(key);
	}

	export function getListOrNull(tag: CompoundTag_, key: string): ListTag_ | null {
		if (!tag.contains(key, $Tag.TAG_LIST)) return null;
		return tag.get(key) as any;
	}

	export function getOrCreateCompound(tag: CompoundTag_, key: string, fallbackSupplier: () => CompoundTag_ = () => new $CompoundTag()): CompoundTag_ {
		if (!tag.contains(key, $Tag.TAG_COMPOUND)) {
			const fallback = fallbackSupplier();
			tag.put(key, fallback);
			return fallback;
		}

		return tag.getCompound(key);
	}

	export function getOrCreateTagList(tag: CompoundTag_, key: string, fallbackSupplier: () => ListTag_ = () => new $ListTag()): ListTag_ {
		if (!tag.contains(key, $Tag.TAG_LIST)) {
			const fallback = fallbackSupplier();
			tag.put(key, fallback);
			return fallback;
		}

		return tag.get(key) as any;
	}
}