// @ts-ignore
type DamageAfterArmorEvent_ = import("io.github.desynq.slimesurvival.event.DamageAfterArmorEvent").$DamageAfterArmorEvent$$Original;
// @ts-ignore
const $DamageAfterArmorEvent: typeof import("io.github.desynq.slimesurvival.event.DamageAfterArmorEvent").$DamageAfterArmorEvent = Java.loadClass("io.github.desynq.slimesurvival.event.DamageAfterArmorEvent");


namespace DamageAfterArmor {

	function getToughnessFactor(entity: LivingEntity_, damage: number, event: DamageAfterArmorEvent_): number {
		if (entity instanceof $ServerPlayer) {
			return 0.5;
		}
		else {
			return 1.0;
		}
	}

	function getArmorFactor(entity: LivingEntity_, damage: number, event: DamageAfterArmorEvent_): number {
		if (entity instanceof $ServerPlayer) {
			if (SculkerSkills.CHITINOUS.isUnlockedFor(entity)) {
				return 15;
			}
			return 20;
		}
		else {
			return 20;
		}
	}

	NativeEvents.onEvent($DamageAfterArmorEvent, event => {
		const entity = event.entity as LivingEntity_;
		const armor = entity.getAttributeValue($Attributes.ARMOR);
		const toughness = entity.getAttributeValue($Attributes.ARMOR_TOUGHNESS);

		let damage = event.getOriginalDamage();

		const armorFactor = getArmorFactor(entity, damage, event);

		const toughnessFactor = getToughnessFactor(entity, damage, event);

		if (damage > 1) {
			damage -= Math.min(damage - 1, toughness * toughnessFactor);
		}

		damage *= armorFactor / (armor + armorFactor);
		event.setFinalDamage(damage);
	});
}