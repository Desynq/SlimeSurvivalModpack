type AttributeHolder_ = import("net.minecraft.core.Holder").$Holder$$Original<import("net.minecraft.world.entity.ai.attributes.Attribute").$Attribute$$Original>;
type AttributeModifierOperation_ = import("net.minecraft.world.entity.ai.attributes.AttributeModifier$Operation").$AttributeModifier$Operation$$Type;


namespace AttributeHelper {
	export function asAttributeHolder(attribute: string): AttributeHolder_ | null {
		const opt = $BuiltInRegistries.ATTRIBUTE.getHolder(attribute);
		if (!opt.isPresent()) {
			return null;
		}
		return opt.get();
	}

	export function hasModifier(entity: LivingEntity_, attribute: AttributeHolder_ | string, modifierId: string): boolean {
		const resolved = resolveAttribute(attribute, modifierId);

		return entity.getAttribute(resolved)?.hasModifier(modifierId) ?? false;
	}

	export function removeModifier(entity: LivingEntity_, attribute: AttributeHolder_ | string, modifierId: string): void {
		if (typeof attribute === "string") {
			let maybeAttribute = asAttributeHolder(attribute);
			if (!maybeAttribute) {
				throw new Error(`Cannot remove modifier of id: ${modifierId} as attribute: ${attribute} is not registered.`);
			}
			attribute = maybeAttribute;
		}

		const rl = $ResourceLocation.parse(modifierId);
		const attrInstance = entity.getAttribute(attribute);
		if (!attrInstance) return;

		attrInstance["removeModifier(net.minecraft.resources.ResourceLocation)"](rl);
	}

	/**
	 * Adds the modifier.
	 * 
	 * Overrides the previous modifier value if it was already set.
	 */
	export function addModifier(entity: LivingEntity_, attribute: AttributeHolder_ | string, modifierId: string, value: double, operation: AttributeModifierOperation_): void {
		if (typeof attribute === "string") {
			let maybeAttribute = asAttributeHolder(attribute);
			if (!maybeAttribute) {
				throw new Error(`Cannot add modifier of id: ${modifierId} as attribute: ${attribute} is not registered.`);
			}
			attribute = maybeAttribute;
		}

		const attrInstance = entity.getAttribute(attribute);
		if (!attrInstance) return;
		if (attrInstance.hasModifier(modifierId)) {
			attrInstance["removeModifier(net.minecraft.resources.ResourceLocation)"](modifierId);
		}

		// @ts-ignore
		attrInstance.addTransientModifier(new $AttributeModifier(
			modifierId,
			value,
			operation
		));
	}

	export function getModifierValue(entity: LivingEntity_, attribute: AttributeHolder_ | string, modifierId: string): number {
		const resolved = resolveAttribute(attribute, modifierId);

		return entity.getAttribute(resolved)?.getModifier(modifierId)?.amount() ?? 0;
	}

	function resolveAttribute(attribute: AttributeHolder_ | string, modifierId: string): AttributeHolder_ {
		if (typeof attribute === "string") {
			const opt = $BuiltInRegistries.ATTRIBUTE.getHolder(attribute);
			if (!opt.isPresent()) {
				throw new Error(`Cannot add modifier of id: ${modifierId} as attribute: ${attribute} is not registered.`);
			}
			return opt.get();
		}
		return attribute;
	}
}