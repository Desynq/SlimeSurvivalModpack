

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

	export function cloneComponents(sourceStack: ItemStack_, targetStack: ItemStack_) {
		const patch = sourceStack.getComponentsPatch();
		if (typeof patch === "function") {
			// @ts-ignore
			patch = patch();
		}

		patch.entrySet().forEach(entry => {
			let compType = entry.getKey();
			if (compType == null) return;

			let upgradeOptional = entry.getValue();
			if (!upgradeOptional.isPresent()) return;

			let upgradeValue = upgradeOptional.get();
			// @ts-ignore
			targetStack.set(compType, upgradeValue);
		});
	}
}