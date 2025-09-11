// @ts-nocheck
PlayerEvents.tick(event => {
	/** @type {Player & ServerPlayer} */
	const player = event.player;

	const race = PlayerRaceHelper.getRace(player);
	const state = SkillHelper.getState(player, Races.SLUDGE.getSkillCategoryId(), SludgeSkills.Flammable.getId());
	if (state !== $Skill$State.UNLOCKED) {
		return;
	}

	if (player.isOnFire()) {
		player.setRemainingFireTicks(100);
	}
});


EntityEvents.afterHurt("minecraft:player", event => {
	const player = event.player;

	if (!SkillHelper.hasSkill(player, Races.SLUDGE.getSkillCategoryId(), SludgeSkills.Flammable.getId())) {
		return;
	}

	ActionbarManager.addSimple(player, event.source.type().msgId());
	const damageType = event.source.type().msgId();
	if (["onFire", "inFire"].indexOf(damageType) === -1) {
		return;
	}

	player.setRemainingFireTicks(100);
});