

namespace ItemHelper {

	export function isCustomItem(stack: import("net.minecraft.world.item.ItemStack").$ItemStack$$Original, id: string) {
		const components = stack.getComponents();
		if (components == null) {
			return false;
		}
		const customData = components.get($DataComponents.CUSTOM_DATA);
		if (customData == null) {
			return false;
		}
		const stackId = customData.copyTag().getString("id");
		return stackId === id;
	}
}