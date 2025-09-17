
(function() {
	const MODIFIER_ID = $ResourceLocation.parse("slimesurvival:wolf_packing");

	PlayerEvents.tick(event => {
		const player = event.getPlayer();

		if (!(player instanceof $ServerPlayer)) {
			return;
		}

		AttributeHelper.removeModifier(player, $Attributes.MAX_HEALTH, MODIFIER_ID);

		if (!SkillHelper.hasSkill(player, ChimeraSkills.WOLF_PACKING)) {
			return;
		}

		const cap = 20;
		const healthToAdd = Math.min(cap, PlayerHelper.getPetsFollowing(player).length);
		if (healthToAdd <= 0) {
			return;
		}

		AttributeHelper.addModifier(player, $Attributes.MAX_HEALTH, MODIFIER_ID, healthToAdd, $AttributeModifier$Operation.ADD_VALUE);
	});
})();