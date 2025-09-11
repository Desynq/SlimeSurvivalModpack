EntityEvents.beforeHurt("minecraft:player", event => {
	const player = event.player;

	// @ts-ignore
	if (!SkillHelper.hasSkill(player, Races.FARLANDER.getSkillCategoryId(), FarlanderSkills.QuantumUncertainty.getId())) {
		return;
	}

	if (event.source.type().msgId() === "genericKill") {
		return;
	}
	const newAbsorptionValue = player.absorptionAmount - event.damage;
	player.setAbsorptionAmount(newAbsorptionValue);
	const postAbsorptionDamage = -Math.min(newAbsorptionValue, 0);

	PlayerEntropy.addEntropy(player, postAbsorptionDamage);
	event.setDamage(0);
});

PlayerEvents.tick(event => {
	PlayerEntropy.tickEntropy(event.player);
});