// @ts-nocheck
PlayerEvents.tick(event => {
	/** @type {Player_ & ServerPlayer_} */
	const player = event.player;

	const race = RaceHelper.getRace(player);
	if (!SkillHelper.hasSkill(player, SludgeSkills.FLAMMABLE)) return;

	if (player.isOnFire()) {
		player.setRemainingFireTicks(100);
	}
});


EntityEvents.afterHurt("minecraft:player", event => {
	const player = event.player;

	if (!(player instanceof $Player)) {
		return;
	}

	if (!SkillHelper.hasSkill(player, SludgeSkills.FLAMMABLE)) {
		return;
	}

	if (!event.source.is($DamageTypeTags.IS_FIRE)) {
		return;
	}

	player.setRemainingFireTicks(100);
});