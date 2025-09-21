

let $Attribute = Java.loadClass("net.minecraft.world.entity.ai.attributes.Attribute");
let $ItemAttributeModifiers$Entry = Java.loadClass("net.minecraft.world.item.component.ItemAttributeModifiers$Entry");
let $ItemAttributeModifiers = Java.loadClass("net.minecraft.world.item.component.ItemAttributeModifiers");
let $EquipmentSlotGroup = Java.loadClass("net.minecraft.world.entity.EquipmentSlotGroup");
const DualWieldMechanic = {};



DualWieldMechanic.AVG_ATTACK_UUID = UUID.fromString("7f1c4f7b-1f6e-4b8c-9e3e-03b6b9a3e6b1");

/**
 * @param {import("net.minecraft.server.level.ServerPlayer").$ServerPlayer$$Original} player
 */
DualWieldMechanic.getMainhandAttackDamage = function(player) {
	const stack = player.getMainHandItem();
	if (stack.isEmpty()) {
		return 0;
	}

	let modifiers = stack.getAttributeModifiers().modifiers();

	let sum = 0;
	modifiers.forEach(entry => {
		if (entry.slot().equals($EquipmentSlotGroup.MAINHAND)) {
			const attribute = entry.attribute();
			const modifier = entry.modifier();
			if (attribute.value() == $Attributes.ATTACK_DAMAGE.value()) {
				sum += modifier.amount();
			}
		}
	});

	return sum;
}

/**
 * @param {$ServerPlayer_} player
 */
DualWieldMechanic.getOffhandAttackDamage = function(player) {
	const stack = player.getOffhandItem();
	if (stack.isEmpty()) {
		return 0;
	}

	let modifiers = stack.getAttributeModifiers().modifiers();

	let sum = 0;
	modifiers.forEach(entry => {
		if (entry.slot().equals($EquipmentSlotGroup.MAINHAND)) {
			const attribute = entry.attribute();
			const modifier = entry.modifier();
			if (attribute.value() == $Attributes.ATTACK_DAMAGE.value()) {
				sum += modifier.amount();
			}
		}
	});

	return sum;
}

PlayerEvents.tick(event => {
	const { player } = event;

	const mhAttackDamage = DualWieldMechanic.getMainhandAttackDamage(player);
	const ohAttackDamage = DualWieldMechanic.getOffhandAttackDamage(player);
	const dualWieldAttackDamage = Math.sqrt((mhAttackDamage ** 2) + (ohAttackDamage ** 2));
});