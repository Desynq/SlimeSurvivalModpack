NativeEvents.onEvent($MobEffectEvent$Added, event => {
	let entity = event.getEntity();
	if (!(entity instanceof $ServerPlayer)) return;
	if (!PlayerRaceHelper.isRace(entity, Races.CHIMERA)) return;
	// if (!SkillHelper.hasSkill(entity, ChimeraSkills.CELLULAR_FUSION)) return;


	let effect = event.getEffectInstance();
	if (!effect.getEffect().value().isBeneficial()) {
		return
	}
	let pets = PlayerHelper.getPetsFollowing(entity);
	if (pets.length == 0) return;
	pets.forEach(pet => {
		let effectCopy = new $MobEffectInstance(effect);
		pet.addEffect(effectCopy);
	})
});