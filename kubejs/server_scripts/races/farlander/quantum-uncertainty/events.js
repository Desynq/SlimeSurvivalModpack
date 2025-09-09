EntityEvents.beforeHurt("minecraft:player", event => {
	const player = event.player;

	if (!PlayerRaceHelper.isRace(player, Races.FARLANDER)) {
		return;
	}

	if (!PlayerRaceSkillHelper.hasSkill(player, FarlanderSkills.QuantumUncertainty)) {
		return;
	}

	if (event.source.type().msgId() === "genericKill") {
		return;
	}
	const newAbsorptionValue = player.absorptionAmount - event.damage;
	player.absorptionAmount -= event.damage; // absorptionAmount gets clamped between 0 and maxAbsorption
	const postAbsorptionDamage = -Math.min(newAbsorptionValue, 0);

	PlayerEntropy.addEntropy(player, postAbsorptionDamage);
	player.tell(postAbsorptionDamage);
	event.setDamage(0);
});

PlayerEvents.tick(event => {
	PlayerEntropy.tickEntropy(event.player);
});