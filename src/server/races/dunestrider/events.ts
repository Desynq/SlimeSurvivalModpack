



PlayerEvents.tick(event => {
	const player = event.player as ServerPlayer_;
	if (!PlayerRaceHelper.isRace(player, Races.DUNESTRIDER)) return;

	if (DunestriderSkills.BLOODCLOT_1.isUnlockedFor(player)) {
		BloodclotSkill.decayOverheal(player);
	}

	HysteriaSkill.tickHysteria(player);

	if ((SkillHelper.hasSkill(player, DunestriderSkills.DEFT))) {
		if (player.getBlockStateOn().getId() == "minecraft:sand") {
			player.modifyAttribute($Attributes.MOVEMENT_SPEED, 'dunestridersandspeed', .5, $AttributeModifier$Operation.ADD_MULTIPLIED_TOTAL as any);
		}
		else {
			player.modifyAttribute($Attributes.MOVEMENT_SPEED, 'dunestridersandspeed', 0, $AttributeModifier$Operation.ADD_MULTIPLIED_TOTAL as any);
		}
	}
});


EntityEvents.death(event => {
	let player = event.getSource().getActual();
	if (!(player instanceof $ServerPlayer)) return;

	if (!(PlayerRaceHelper.isRace(player, Races.DUNESTRIDER))) return;

	if ((SkillHelper.hasSkill(player, DunestriderSkills.HYSTERIA_3))) {
		if (HysteriaSkill.hasMaxHysteria(player)) {
			let extraSat = player.getSaturation() >= 10 ? 0 : player.getSaturation() + 1;
			player.setSaturation(extraSat);
		}
	}

	FuranturSkill.onEntityDeath(player, event.getEntity());
});