

namespace StackHelper {

	export function isCustomItem(stack: ItemStack_, id: string) {
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

	export function isCustomFlagSet(stack: unknown, id: string): stack is ItemStack_ {
		if (!(stack instanceof $ItemStack)) return false;

		const customData = stack.getComponents()?.get($DataComponents.CUSTOM_DATA);
		if (!customData) return false;

		return customData.copyTag().getBoolean(id);
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

	/**
	 * @returns `null` if the enchantment does not exist on the item or the item does not have enchantments.
	 * @returns 0-255 otherwise.
	 */
	export function getEnchantmentLevel(server: MinecraftServer_, stack: ItemStack_, id: string): integer | null {
		let stackEnchants = stack.getComponents()?.get($DataComponents.ENCHANTMENTS);
		if (!stackEnchants) return null;

		const maybeEnchantment = server.registryAccess().registryOrThrow($Registries.ENCHANTMENT).getHolder(id);
		if (maybeEnchantment.isEmpty()) return null;
		return stackEnchants.getLevel(maybeEnchantment.get());
	}
}