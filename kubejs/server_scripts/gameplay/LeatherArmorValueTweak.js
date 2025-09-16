// @ts-nocheck
/** @type {typeof import("net.minecraft.world.entity.EquipmentSlot").$EquipmentSlot } */
let $EquipmentSlot = Java.loadClass("net.minecraft.world.entity.EquipmentSlot")
const LeatherArmorValueTweak = {};

LeatherArmorValueTweak.modifierId = $ResourceLocation.parse("slimesurvival:leather_armor_tweak");


/**
 * 
 * @param {import("net.minecraft.server.level.ServerPlayer").$ServerPlayer$$Original} player 
 */
LeatherArmorValueTweak.calculateTweak = function(player) {
	let totalDamageAdjustedArmorValue = 0;
	player.getArmorSlots().forEach(stack => {
		if (stack == null) {
			return;
		}
		const item = stack.getItem();
		if (item instanceof $ArmorItem && item.getMaterial() == $ArmorMaterials.LEATHER) {
			let slot = player.getEquipmentSlotForItem(stack);
			stack.attributeModifiers["forEach(net.minecraft.world.entity.EquipmentSlot,java.util.function.BiConsumer)"](slot, (attribute, modifier) => totalDamageAdjustedArmorValue += LeatherArmorValueTweak.getDamageAdjustedBonusValue(stack, slot, attribute, modifier));
		}
	});

	LeatherArmorValueTweak.applyTweak(player, totalDamageAdjustedArmorValue);
	// ActionbarManager.addText(player.uuid.toString(), `"${totalDamageAdjustedArmorValue}"`);
}

/**
 * @param {import("net.minecraft.world.item.ItemStack").$ItemStack$$Original} stack
 * @param {import("net.minecraft.world.entity.EquipmentSlot").$EquipmentSlot$$Original} slot
 * @param {import("net.minecraft.core.Holder").$Holder$$Original<import("net.minecraft.world.entity.ai.attributes.Attribute").$Attribute$$Original>} attribute 
 * @param {import("net.minecraft.world.entity.ai.attributes.AttributeModifier").$AttributeModifier$$Original} modifier
 */
LeatherArmorValueTweak.getDamageAdjustedBonusValue = function(stack, slot, attribute, modifier) {
	if (attribute != $Attributes.ARMOR) {
		return 0;
	}
	if (modifier.operation() != $AttributeModifier$Operation.ADD_VALUE) {
		return 0;
	}

	let additionalValue = 0;
	switch (slot) {
		case $EquipmentSlot.HEAD:
			additionalValue = 2;
			break;
		case $EquipmentSlot.CHEST:
			additionalValue = 5;
			break;
		case $EquipmentSlot.LEGS:
			additionalValue = 4;
			break;
		case $EquipmentSlot.FEET:
			additionalValue = 2;
	}
	return additionalValue * (1 - stack.damageValue / Math.max(1, stack.maxDamage - 1));
}



/**
 * 
 * @param {import("net.minecraft.server.level.ServerPlayer").$ServerPlayer$$Original} player 
 * @param {double} value
 */
LeatherArmorValueTweak.applyTweak = function(player, value) {
	player.getAttribute($Attributes.ARMOR)["removeModifier(net.minecraft.resources.ResourceLocation)"](LeatherArmorValueTweak.modifierId);
	if (value <= 0) {
		return;
	}
	player.getAttribute($Attributes.ARMOR).addTransientModifier(new $AttributeModifier(
		LeatherArmorValueTweak.modifierId,
		value,
		$AttributeModifier$Operation.ADD_VALUE
	));
}