

/**
 * 
 * @param {ChimeraPlayer} chimera
 */
function ChimeraTick(chimera) {
	this.chimera = chimera;
	this.player = chimera.player;
	this.petsFollowing = PlayerHelper.getPetsFollowing(this.player);

	this.tickWolfPacking();
	this.tickPackMarathon();
	this.tickFortitude();
}

ChimeraTick.prototype.tickWolfPacking = function() {
	const MODIFIER_ID = "slimesurvival:wolf_packing";

	AttributeHelper.removeModifier(this.player, $Attributes.MAX_HEALTH, MODIFIER_ID);

	if (!SkillHelper.hasSkill(this.player, ChimeraSkills.WOLF_PACKING)) {
		return;
	}

	const cap = 20;
	const healthToAdd = Math.min(cap, this.petsFollowing.length);
	if (healthToAdd <= 0) {
		return;
	}

	AttributeHelper.addModifier(this.player, $Attributes.MAX_HEALTH, MODIFIER_ID, healthToAdd, "add_value");
}

ChimeraTick.prototype.tickPackMarathon = function() {
	const MODIFIER_ID = "slimesurvival:pack_marathon";

	this.petsFollowing.forEach(pet => {
		AttributeHelper.removeModifier(pet, $Attributes.MOVEMENT_SPEED, MODIFIER_ID);
	});

	if (!(this.player.sprinting && SkillHelper.hasSkill(this.player, ChimeraSkills.PACK_MARATHON))) {
		return;
	}

	this.petsFollowing.forEach(pet => {
		AttributeHelper.addModifier(pet, $Attributes.MOVEMENT_SPEED, MODIFIER_ID, 1, "add_multiplied_total");
	});
}

ChimeraTick.prototype.tickFortitude = function() {
	if (this.player.health < this.player.maxHealth * 0.5) {
		return;
	}
	const fortitudeLevel = SkillHelper.getSkillTier(this.player,
		ChimeraSkills.FORTITUDE_1,
		ChimeraSkills.FORTITUDE_2,
		ChimeraSkills.FORTITUDE_3
	);
	if (fortitudeLevel === 0) {
		return;
	}
	this.petsFollowing.forEach(pet => {
		LivingEntityHelper.addEffect(pet, "minecraft:resistance", 1, fortitudeLevel - 1, false, true, true, this.player);
	});
}