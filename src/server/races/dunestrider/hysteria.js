/**
 * 
 * @param {import("net.minecraft.world.entity.Mob").$Mob$$Original} mob 
 * @param {ServerPlayer} player 
 * @returns {Boolean}
*/
function isTargeting(mob, player) {
	return mob.getTarget() == player;
}
/**
 * @param {ServerPlayer} player 
 * @returns {integer}
*/
function targetedByNum(player) {
	let aabb = player.getBoundingBox().inflate(16, 16, 16);
	// @ts-ignore
	return player.level.getEntitiesOfClass($Mob, aabb, mob => isTargeting(mob, player)).size()
}

PlayerEvents.tick(event => {
	let player = event.getEntity();
	if (!(player instanceof $ServerPlayer)) return;
	if (!(PlayerRaceHelper.isRace(player, Races.DUNESTRIDER))) return;

	if ((SkillHelper.hasSkill(player, DunestriderSkills.HYSTERIA_1))) {
		let skillLvl = SkillHelper.getSkillTier(player, DunestriderSkills.HYSTERIA_1, DunestriderSkills.HYSTERIA_2, DunestriderSkills.HYSTERIA_3);
		let enemyCount = targetedByNum(player);
		let baseSpeed = player.getAttributeBaseValue($Attributes.MOVEMENT_SPEED);
		let baseAttackSpeed = player.getAttributeBaseValue($Attributes.ATTACK_SPEED);
		let extraSpeed = enemyCount * 0.005
		let extraAttackSpeed = enemyCount * 0.25
		let capSpeed = baseSpeed * 2
		let capAttackSpeed = baseAttackSpeed * 2
		let maxStackSpeed = false;
		let maxStackAttackSpeed = false;
		if (extraSpeed + baseSpeed > capSpeed) { extraSpeed = capSpeed; maxStackSpeed = true }
		if (extraAttackSpeed + baseAttackSpeed > capAttackSpeed) { extraAttackSpeed = capAttackSpeed; maxStackAttackSpeed = true }
		switch (skillLvl) {
			case 1:
				player.modifyAttribute($Attributes.MOVEMENT_SPEED, 'dunestriderhysteriaspeed', extraSpeed, $AttributeModifier$Operation.ADD_VALUE)
				break;
			case 2:
				player.modifyAttribute($Attributes.MOVEMENT_SPEED, 'dunestriderhysteriaspeed', extraSpeed, $AttributeModifier$Operation.ADD_VALUE)
				player.modifyAttribute($Attributes.ATTACK_SPEED, 'dunestriderhysteriaattackspeed', extraAttackSpeed, $AttributeModifier$Operation.ADD_VALUE)
				break;
			case 3:
				player.modifyAttribute($Attributes.MOVEMENT_SPEED, 'dunestriderhysteriaspeed', extraSpeed, $AttributeModifier$Operation.ADD_VALUE)
				player.modifyAttribute($Attributes.ATTACK_SPEED, 'dunestriderhysteriaattackspeed', extraAttackSpeed, $AttributeModifier$Operation.ADD_VALUE)
				if (maxStackSpeed && maxStackAttackSpeed) { player.persistentData.putBoolean('dunestrider.hysteriamax', true) }
				else { player.persistentData.putBoolean('dunestrider.hysteriamax', false) }
				break;
		}
	};

	if ((SkillHelper.hasSkill(player, DunestriderSkills.DEFT))) {
		let pos = {};
		pos.x = player.getX() - 1;
		pos.y = player.getY() - 1;
		pos.z = player.getZ();
		let standingOn = player.level.getBlock([pos.x, pos.y, pos.z])
		if (standingOn.getId() == "minecraft:sand") {
			player.modifyAttribute($Attributes.MOVEMENT_SPEED, 'dunestridersandspeed', .5, $AttributeModifier$Operation.ADD_MULTIPLIED_TOTAL)
		} else {
			player.modifyAttribute($Attributes.MOVEMENT_SPEED, 'dunestridersandspeed', 0, $AttributeModifier$Operation.ADD_MULTIPLIED_TOTAL)
		}
	}
});

EntityEvents.death(event => {
	let player = event.getSource().getActual();
	if (!(player instanceof $ServerPlayer)) return;
	if (!(PlayerRaceHelper.isRace(player, Races.DUNESTRIDER))) return;
	if (!(SkillHelper.hasSkill(player, DunestriderSkills.HYSTERIA_3))) return;
	if (player.persistentData.getBoolean('dunestrider.hysteriamax')) { player.setSaturation(player.saturation + 1) }
})