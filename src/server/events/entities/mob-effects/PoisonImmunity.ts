


namespace PoisonImmunity {

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

	NativeEvents.onEvent($MobEffectEvent$Applicable, event => {
		const entity = event.entity;

		const isPoison = event.effectInstance.is($MobEffects.POISON);

		if (isPoison && isImmuneToPoison(entity)) {
			event.setResult("do_not_apply");
		}
	});
}