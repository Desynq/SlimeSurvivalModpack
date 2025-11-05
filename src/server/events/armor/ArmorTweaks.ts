let $LivingEquipmentChangeEvent: typeof import("net.neoforged.neoforge.event.entity.living.LivingEquipmentChangeEvent").$LivingEquipmentChangeEvent = Java.loadClass("net.neoforged.neoforge.event.entity.living.LivingEquipmentChangeEvent");

let $BiConsumer: typeof import("java.util.function.BiConsumer").$BiConsumer = Java.loadClass("java.util.function.BiConsumer");
let $EquipmentSlot$Type: typeof import("net.minecraft.world.entity.EquipmentSlot$Type").$EquipmentSlot$Type = Java.loadClass("net.minecraft.world.entity.EquipmentSlot$Type");
let $ArmorMaterials: typeof import("net.minecraft.world.item.ArmorMaterials").$ArmorMaterials = Java.loadClass("net.minecraft.world.item.ArmorMaterials");

namespace ArmorTweaks {


	NativeEvents.onEvent($ArmorHurtEvent, event => {
		const player = event.entity instanceof $ServerPlayer ? event.entity : null;
		if (player == null) {
			return;
		}

		event.armorMap.forEach((slot, entry) => {
			let stack = entry.armorItemStack;
			if (!(stack.getItem() instanceof $ArmorItem)) return;

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
				player.setItemSlot(slot as any, $ItemStack.EMPTY as any);
				if (!player.inventory.add(stack as any)) {
					player.drop(stack.copy(), false);
				}
				player.inventory.setChanged();
				player.containerMenu.broadcastChanges();
			}
		});
	});

	function isArmorMaterialLeather(stack: import("net.minecraft.world.item.ItemStack").$ItemStack$$Original): boolean {
		const item = stack.getItem();
		return item instanceof $ArmorItem && item.getMaterial() === $ArmorMaterials.LEATHER;
	}

	NativeEvents.onEvent($LivingEquipmentChangeEvent, event => {
		let player = event.entity;
		let slot = event.slot;
		let fromStack = event.from;
		let toStack = event.to;

		if (!(toStack.getItem() instanceof $ArmorItem)) return;

		if (player instanceof $ServerPlayer && slot.armor && !toStack.isEmpty() && toStack.damageableItem && toStack.damageValue >= toStack.maxDamage - 1 && !isArmorMaterialLeather(toStack)) {
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
		const player = event.getPlayer() as ServerPlayer_;

		LeatherArmorValueTweak.calculateTweak(player);
	});
}