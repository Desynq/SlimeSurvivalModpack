// @ts-nocheck
/** @type {typeof import("net.minecraft.core.registries.BuiltInRegistries").$BuiltInRegistries } */
let $BuiltInRegistries = Java.loadClass("net.minecraft.core.registries.BuiltInRegistries")
/** @type {typeof import("java.util.function.BiConsumer").$BiConsumer } */
let $BiConsumer = Java.loadClass("java.util.function.BiConsumer")
/** @type {typeof import("net.minecraft.world.entity.ai.attributes.AttributeModifier$Operation").$AttributeModifier$Operation } */
let $AttributeModifier$Operation = Java.loadClass("net.minecraft.world.entity.ai.attributes.AttributeModifier$Operation")
/** @type {typeof import("net.minecraft.world.entity.EquipmentSlot$Type").$EquipmentSlot$Type } */
let $EquipmentSlot$Type = Java.loadClass("net.minecraft.world.entity.EquipmentSlot$Type")
/** @type {typeof import("net.neoforged.neoforge.event.entity.living.ArmorHurtEvent").$ArmorHurtEvent } */
let $ArmorHurtEvent = Java.loadClass("net.neoforged.neoforge.event.entity.living.ArmorHurtEvent")
/** @type {typeof import("net.minecraft.world.item.ArmorMaterials").$ArmorMaterials } */
let $ArmorMaterials = Java.loadClass("net.minecraft.world.item.ArmorMaterials")
/** @type {typeof import("net.minecraft.world.item.ArmorItem").$ArmorItem } */
let $ArmorItem = Java.loadClass("net.minecraft.world.item.ArmorItem")
/** @type {typeof import("net.minecraft.world.item.ItemStack").$ItemStack } */
let $ItemStack = Java.loadClass("net.minecraft.world.item.ItemStack")

NativeEvents.onEvent($ArmorHurtEvent, event => {
	const player = event.entity instanceof $ServerPlayer ? event.entity : null;
	if (player == null) {
		return;
	}

	event.armorMap.forEach((slot, entry) => {
		let stack = entry.armorItemStack;
		if (isArmorMaterialLeather(stack)) {
			let damageLeft = stack.maxDamage - stack.damageValue;
			// cap leather armor damage to 1 and ensure it never puts the armor piece below 1 durability
			entry.newDamage = Math.max(0, Math.min(entry.originalDamage, 1, damageLeft - 1));
		}
	});

	/**
	 * @param {import("net.minecraft.world.item.ItemStack").$ItemStack$$Original} stack 
	 */
	function isArmorMaterialLeather(stack) {
		const item = stack.getItem();
		const armorItem = item instanceof $ArmorItem ? item : null;
		if (armorItem == null) {
			return false;
		}
		return armorItem.getMaterial() == $ArmorMaterials.LEATHER;
	}
});




PlayerEvents.tick(event => {
	const { player } = event;

	LeatherArmorValueTweak.calculateTweak(player);
});