// @ts-nocheck
/** @type {typeof import("net.minecraft.world.entity.EquipmentSlot").$EquipmentSlot } */
let $EquipmentSlot = Java.loadClass("net.minecraft.world.entity.EquipmentSlot");

namespace LeatherArmorValueTweak {
	const modifierId = $ResourceLocation.parse("slimesurvival:leather_armor_tweak");



	export function calculateTweak(player: ServerPlayer_) {
		let totalDamageAdjustedArmorValue = 0;
		player.getArmorSlots().forEach(stack => {
			if (!stack) return;
			if (isCustomLeatherArmor(stack)) return;

			const item = stack.getItem();
			if (item instanceof $ArmorItem && item.getMaterial() == $ArmorMaterials.LEATHER) {
				let slot = player.getEquipmentSlotForItem(stack);
				stack.attributeModifiers["forEach(net.minecraft.world.entity.EquipmentSlot,java.util.function.BiConsumer)"](slot, (attribute, modifier) => totalDamageAdjustedArmorValue += getDamageAdjustedBonusValue(stack, slot, attribute, modifier));
			}
		});

		LeatherArmorValueTweak.applyTweak(player, totalDamageAdjustedArmorValue);
		// ActionbarManager.addText(player.uuid.toString(), `"${totalDamageAdjustedArmorValue}"`);
	}

	function isCustomLeatherArmor(stack: ItemStack_) {
		return StackHelper.isCustomFlagSet(stack, "bee_queen_armor");
	}

	function getDamageAdjustedBonusValue(stack: ItemStack_, slot: EquipmentSlot_, attribute: Holder_<Attribute_>, modifier: AttributeModifier_) {
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


	export function applyTweak(player: ServerPlayer_, value: double) {
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
}