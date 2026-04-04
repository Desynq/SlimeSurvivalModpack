


namespace EffectImmunityImpl {

	function isImmuneToPoison(entity: LivingEntity_): boolean {
		if (entity instanceof $ServerPlayer) {
			if (SludgeSkills.ANTIVENOM.isUnlockedFor(entity)) {
				return true;
			}
		}
		else if (EntityHelper.isType(entity, "minecraft:slime")) {
			return true;
		}

		return false;
	}

	function isImmuneToHunger(entity: LivingEntity_, amplifier: number): boolean {
		if (entity instanceof $ServerPlayer) {
			if (amplifier === 0 && SculkerSkills.AUTOTROPH.isUnlockedFor(entity)) {
				return true;
			}
		}

		return false;
	}

	NativeEvents.onEvent($MobEffectEvent$Applicable, event => {
		const entity = event.entity;

		switch (event.effectInstance.effect) {
			case $MobEffects.POISON: {
				if (isImmuneToPoison(entity)) {
					event.setResult("do_not_apply");
				}
				break;
			}
			case $MobEffects.HUNGER: {
				if (isImmuneToHunger(entity, event.effectInstance.amplifier)) {
					event.setResult("do_not_apply");
				}
				break;
			}
		}
	});
}