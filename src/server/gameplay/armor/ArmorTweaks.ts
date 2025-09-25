let $LivingEquipmentChangeEvent: typeof import("net.neoforged.neoforge.event.entity.living.LivingEquipmentChangeEvent").$LivingEquipmentChangeEvent = Java.loadClass("net.neoforged.neoforge.event.entity.living.LivingEquipmentChangeEvent");

/** @type {typeof import("java.util.function.BiConsumer").$BiConsumer } */
let $BiConsumer = Java.loadClass("java.util.function.BiConsumer");
/** @type {typeof import("net.minecraft.world.entity.EquipmentSlot$Type").$EquipmentSlot$Type } */
let $EquipmentSlot$Type = Java.loadClass("net.minecraft.world.entity.EquipmentSlot$Type");
/** @type {typeof import("net.neoforged.neoforge.event.entity.living.ArmorHurtEvent").$ArmorHurtEvent } */
let $ArmorHurtEvent: typeof import("net.neoforged.neoforge.event.entity.living.ArmorHurtEvent").$ArmorHurtEvent = Java.loadClass("net.neoforged.neoforge.event.entity.living.ArmorHurtEvent");
/** @type {typeof import("net.minecraft.world.item.ArmorMaterials").$ArmorMaterials } */
let $ArmorMaterials = Java.loadClass("net.minecraft.world.item.ArmorMaterials");
/** @type {typeof import("net.minecraft.world.item.ArmorItem").$ArmorItem } */
let $ArmorItem = Java.loadClass("net.minecraft.world.item.ArmorItem");

let $ItemStack: typeof import("net.minecraft.world.item.ItemStack").$ItemStack = Java.loadClass("net.minecraft.world.item.ItemStack");


namespace ArmorTweaks {


	NativeEvents.onEvent($ArmorHurtEvent, event => {
		const player = event.entity instanceof $ServerPlayer ? event.entity : null;
		if (player == null) {
			return;
		}

		event.armorMap.forEach((slot, entry) => {
			let stack = entry.armorItemStack;

			let damageLeft = stack.maxDamage - stack.damageValue;
			let cap = Math.floor(stack.maxDamage * 0.05);
			let cappedDamage = Math.min(entry.originalDamage, cap);
			if (entry.originalDamage >= 1 && cappedDamage < 1) {
				cappedDamage = 1;
			}
			// ensure it doesn't go past the breaking threshold
			entry.newDamage = Math.min(cappedDamage, damageLeft - 1);

			damageLeft -= entry.newDamage;
			if (damageLeft <= 1 && !isArmorMaterialLeather(stack)) {
				stack.setDamage(stack.maxDamage - 1);
				// @ts-ignore
				player.setItemSlot(slot, $ItemStack.EMPTY);
				// @ts-ignore
				let added = player.inventory.add(stack);
				if (!added) {
					player.drop(stack, false);
				}
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

	NativeEvents.onEvent($LivingEquipmentChangeEvent, event => {
		let player = event.entity;
		if (!(player instanceof $ServerPlayer)) return;
		let slot = event.slot;
		let fromStack = event.from;
		let toStack = event.to;

		if (!slot.armor) return;
		if (toStack.isEmpty()) return; // nothing being equipped

		if (toStack.damageValue >= toStack.maxDamage - 1) {
			// @ts-ignore
			let added = player.inventory.add(toStack);
			if (!added) {
				player.drop(toStack, false);
			}

			// @ts-ignore
			player.setItemSlot(slot, fromStack.copy());
			player.inventory.setChanged();
			player.containerMenu.broadcastChanges();
		}
	});


	PlayerEvents.tick(event => {
		const player = event.getPlayer() as ServerPlayer;

		LeatherArmorValueTweak.calculateTweak(player);
	});
}