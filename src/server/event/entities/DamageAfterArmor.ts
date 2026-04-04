// @ts-expect-error
const $DamageAfterArmorEvent: typeof import("io.github.desynq.slimesurvival.common.event.DamageAfterArmorEvent").$DamageAfterArmorEvent =
	Java.loadClass("io.github.desynq.slimesurvival.common.event.DamageAfterArmorEvent");


namespace DamageAfterArmor {

	NativeEvents.onEvent("highest", $DamageAfterArmorEvent, event => {
		const entity = event.entity as LivingEntity_;
		const armor = entity.getAttributeValue($Attributes.ARMOR);
		const toughness = entity.getAttributeValue($Attributes.ARMOR_TOUGHNESS);

		let damage = event.getOriginalDamage();

		const armorFactor = ArmorHelper.getArmorFactor(entity, damage, event);

		const toughnessFactor = ArmorHelper.getToughnessFactor(entity, damage, event);

		if (damage > 1) {
			damage -= Math.min(damage - 1, toughness * toughnessFactor);
		}

		damage *= armorFactor / (armor + armorFactor);
		event.setFinalDamage(damage);
	});
}