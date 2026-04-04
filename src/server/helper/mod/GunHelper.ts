// priority: 1000

namespace GunHelper {

	export function isSuppressed(stack: unknown): boolean {
		if (!(stack instanceof $ItemStack)) return false;

		const customData = stack.getComponents()?.get($DataComponents.CUSTOM_DATA)?.copyTag();
		if (!customData) return false;

		const muzzleTag = NBTHelper.getCompoundOrNull(customData, "AttachmentMUZZLE");
		if (!muzzleTag) return false;

		const muzzleTagComps = NBTHelper.getCompoundOrNull(muzzleTag, "components");
		if (!muzzleTagComps) return false;

		const muzzleData = NBTHelper.getCompoundOrNull(muzzleTagComps, "minecraft:custom_data");
		if (!muzzleData) return false;

		const muzzle = NBTHelper.getStringOrNull(muzzleData, "AttachmentId");
		if (!muzzle) return false;
		if (!muzzle.startsWith("tacz:muzzle_silencer")) return false;

		return true;
	}
}