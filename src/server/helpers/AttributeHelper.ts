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

	export function removeModifier(entity: LivingEntity_, attribute: AttributeHolder_ | string, modifierId: string) {
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

	export function addModifier(entity: LivingEntity_, attribute: AttributeHolder_ | string, modifierId: string, value: double, operation: AttributeModifierOperation_) {
		if (typeof attribute === "string") {
			let maybeAttribute = asAttributeHolder(attribute);
			if (!maybeAttribute) {
				throw new Error(`Cannot add modifier of id: ${modifierId} as attribute: ${attribute} is not registered.`);
			}
			attribute = maybeAttribute;
		}

		const attrInstance = entity.getAttribute(attribute);
		if (!attrInstance) return;
		if (attrInstance.hasModifier(modifierId)) return;

		// @ts-ignore
		attrInstance.addTransientModifier(new $AttributeModifier(
			modifierId,
			value,
			operation
		));
	}
}