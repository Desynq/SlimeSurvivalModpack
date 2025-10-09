


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

	NativeEvents.onEvent($EntityTickEvent$Post, event => {
		const entity = event.entity;

		if (!(entity instanceof $ServerPlayer) && entity instanceof $LivingEntity && isImmuneToPoison(entity)) {
			entity.removeEffect($MobEffects.POISON);
		}
	});

	PlayerEvents.tick(event => {
		const player = event.entity as ServerPlayer_;
		if (isImmuneToPoison(player)) {
			player.removeEffect($MobEffects.POISON);
		}
	});

	NativeEvents.onEvent($LivingIncomingDamageEvent, event => {
		const entity = event.entity;
		if (!isImmuneToPoison(entity)) return;

		// best way to detect if it's poison damage lmao
		if (event.getSource().getType() === "magic" && entity.hasEffect($MobEffects.POISON)) {
			event.setCanceled(true);
		}
	});
}