// @ts-nocheck
PlayerEvents.tick(event => {
	/** @type {Player & ServerPlayer} */
	const player = event.player;

	const race = PlayerRaceHelper.getRace(player);
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

	const damageType = event.source.type().msgId();
	if (["onFire", "inFire", "lava"].indexOf(damageType) === -1) {
		return;
	}

	player.setRemainingFireTicks(100);
});