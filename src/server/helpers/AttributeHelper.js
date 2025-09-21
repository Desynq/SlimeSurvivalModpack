const AttributeHelper = {};

/**
 * 
 * @param {LivingEntity} entity 
 * @param {import("net.minecraft.core.Holder").$Holder$$Original<import("net.minecraft.world.entity.ai.attributes.Attribute").$Attribute$$Original>} attribute 
 * @param {string} modifierId 
 */
AttributeHelper.removeModifier = function(entity, attribute, modifierId) {
	// @ts-ignore
	const rl = $ResourceLocation.parse(modifierId);
	entity.getAttribute(attribute)["removeModifier(net.minecraft.resources.ResourceLocation)"](rl);
}

/**
 * 
 * @param {LivingEntity} entity 
 * @param {import("net.minecraft.core.Holder").$Holder$$Original<import("net.minecraft.world.entity.ai.attributes.Attribute").$Attribute$$Original>} attribute 
 * @param {string} modifierId 
 * @param {double} value 
 * @param {import("net.minecraft.world.entity.ai.attributes.AttributeModifier$Operation").$AttributeModifier$Operation$$Type} operation 
 */
AttributeHelper.addModifier = function(entity, attribute, modifierId, value, operation) {
	// @ts-ignore
	const rl = $ResourceLocation.parse(modifierId);
	// @ts-ignore
	entity.getAttribute(attribute).addTransientModifier(new $AttributeModifier(
		// @ts-ignore
		rl,
		value,
		operation
	));
}	