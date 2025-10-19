



PlayerEvents.tick(event => {
	const player = event.player as ServerPlayer_;
	if (!PlayerRaceHelper.isRace(player, Races.DUNESTRIDER)) return;

	if (DunestriderSkills.BLOODCLOT_1.isUnlockedFor(player)) {
		BloodclotSkill.decayOverheal(player);
	}
});