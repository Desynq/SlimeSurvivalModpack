// priority: 1000

namespace ArmorHelper {
	export function getToughnessFactor(entity: LivingEntity_, damage: number, event: DamageAfterArmorEvent_): number {
		if (entity instanceof $ServerPlayer) {
			return 0.5;
		}
		else {
			return 1.0;
		}
	}

	export function getArmorFactor(entity: LivingEntity_, damage: number, event: DamageAfterArmorEvent_): number {
		if (entity instanceof $ServerPlayer) {
			if (SculkerSkills.CHITINOUS.isUnlockedFor(entity)) {
				return SculkerSkills.CHITINOUS.data.armorFactor;
			}

			return 20;
		}
		else {
			return 20;
		}
	}
}