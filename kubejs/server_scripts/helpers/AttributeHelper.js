const AttributeHelper = {};

/**
 * 
 * @param {LivingEntity} entity 
 * @param {import("net.minecraft.core.Holder").$Holder$$Original<import("net.minecraft.world.entity.ai.attributes.Attribute").$Attribute$$Original>} attribute 
 * @param {import("net.minecraft.resources.ResourceLocation").$ResourceLocation$$Original} modifierId 
 */
AttributeHelper.removeModifier = function(entity, attribute, modifierId) {
	entity.getAttribute(attribute)["removeModifier(net.minecraft.resources.ResourceLocation)"](modifierId);
}

/**
 * 
 * @param {LivingEntity} entity 
 * @param {import("net.minecraft.core.Holder").$Holder$$Original<import("net.minecraft.world.entity.ai.attributes.Attribute").$Attribute$$Original>} attribute 
 * @param {import("net.minecraft.resources.ResourceLocation").$ResourceLocation$$Original} modifierId 
 * @param {double} value 
 * @param {import("net.minecraft.world.entity.ai.attributes.AttributeModifier$Operation").$AttributeModifier$Operation$$Original} operation 
 */
AttributeHelper.addModifier = function(entity, attribute, modifierId, value, operation) {
	// @ts-ignore
	entity.getAttribute(attribute).addTransientModifier(new $AttributeModifier(
		// @ts-ignore
		modifierId,
		value,
		operation
	));
}	