

/**
 * 
 * @param {ServerPlayer} player Chimera race player
 */
function ChimeraTick(player) {
	this.player = player;
	this.petsFollowing = PlayerHelper.getPetsFollowing(player);

	this.tickWolfPacking();
}

ChimeraTick.prototype.tickWolfPacking = function() {
	const MODIFIER_ID = $ResourceLocation.parse("slimesurvival:wolf_packing");

	AttributeHelper.removeModifier(this.player, $Attributes.MAX_HEALTH, MODIFIER_ID);

	if (!SkillHelper.hasSkill(this.player, ChimeraSkills.WOLF_PACKING)) {
		return;
	}

	const cap = 20;
	const healthToAdd = Math.min(cap, this.petsFollowing.length);
	if (healthToAdd <= 0) {
		return;
	}

	AttributeHelper.addModifier(this.player, $Attributes.MAX_HEALTH, MODIFIER_ID, healthToAdd, $AttributeModifier$Operation.ADD_VALUE);
}

ChimeraTick.prototype.tickPackMarathon = function() {

}

PlayerEvents.tick(event => {
	if (event.player instanceof $ServerPlayer && PlayerRaceHelper.hasRace(event.player)) {
		new ChimeraTick(event.player);
	}
});