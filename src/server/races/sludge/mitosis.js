const Mitosis = {};

/**
 * @param {ServerPlayer_} player 
 */
Mitosis.getMitoticAccelerationLevel = function(player) {
	/** @type {[integer, Skill][]} */
	const levels = [
		[4, MitosisSkillTree.MITOTIC_ACCELERATION_4],
		[3, MitosisSkillTree.MITOTIC_ACCELERATION_3],
		[2, MitosisSkillTree.MITOTIC_ACCELERATION_2],
		[1, MitosisSkillTree.MITOTIC_ACCELERATION_1],
	];
	for (let i = 0; i < levels.length; i++) {
		if (SkillHelper.hasSkill(player, levels[i][1])) {
			return levels[i][0];
		}
	}
	return 0;
}

/**
 * 
 * @param {ServerPlayer_} player 
 */
Mitosis.getMitosisInterval = function(player) {
	switch (Mitosis.getMitoticAccelerationLevel(player)) {
		case 4:
			return 0.2;
		case 3:
			return 0.4;
		case 2:
			return 0.6;
		case 1:
			return 0.8;
		default:
			return 1.0;
	}
}

PlayerEvents.tick(event => {
	/** @type {ServerPlayer_} */
	// @ts-ignore
	const player = event.player;

	if (player.deadOrDying || player.health <= 0 || player.health >= player.maxHealth || player.onFire) {
		return;
	}

	const hasApoptosis = SkillHelper.hasSkill(player, MitosisSkillTree.APOPTOSIS)
	const minimumHungerLevelNeeded = hasApoptosis ? 0 : 6;
	if (player.foodData.foodLevel + player.foodData.saturationLevel <= minimumHungerLevelNeeded) {
		return;
	}

	if (!SkillHelper.hasSkill(player, MitosisSkillTree.MITOSIS)) {
		return;
	}

	const baseInterval = 40;
	const interval = Math.max(baseInterval * Mitosis.getMitosisInterval(player), 1);
	if (player.server.tickCount % interval !== 0) {
		return;
	}

	const newHealth = Math.min(player.health + 1, player.maxHealth);
	player.setHealth(newHealth);

	const exhaustion = 4 * (hasApoptosis ? 0.5 : 1);
	player.addExhaustion(exhaustion);
});