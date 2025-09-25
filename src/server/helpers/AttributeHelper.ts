type _AttributeHolder = import("net.minecraft.core.Holder").$Holder$$Original<import("net.minecraft.world.entity.ai.attributes.Attribute").$Attribute$$Original>;
type _AttributeModifierOperation = import("net.minecraft.world.entity.ai.attributes.AttributeModifier$Operation").$AttributeModifier$Operation$$Type;


namespace AttributeHelper {
	export function asAttributeHolder(attribute: string): _AttributeHolder | null {
		const opt = $BuiltInRegistries.ATTRIBUTE.getHolder($ResourceLocation.parse(attribute));
		if (!opt.isPresent()) {
			return null;
		}
		return opt.get();
	}

	export function removeModifier(entity: LivingEntity, attribute: _AttributeHolder | string, modifierId: string) {
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

	export function addModifier(entity: LivingEntity, attribute: _AttributeHolder | string, modifierId: string, value: double, operation: _AttributeModifierOperation) {
		if (typeof attribute === "string") {
			let maybeAttribute = asAttributeHolder(attribute);
			if (!maybeAttribute) {
				throw new Error(`Cannot add modifier of id: ${modifierId} as attribute: ${attribute} is not registered.`);
			}
			attribute = maybeAttribute;
		}

		const rl = $ResourceLocation.parse(modifierId);
		const attrInstance = entity.getAttribute(attribute);
		if (!attrInstance) return;
		if (attrInstance.hasModifier(rl)) return;

		// @ts-ignore
		attrInstance.addTransientModifier(new $AttributeModifier(
			// @ts-ignore
			rl,
			value,
			operation
		));
	}
}