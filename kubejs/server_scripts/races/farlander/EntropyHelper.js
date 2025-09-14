const EntropyHelper = {};

/**
 * 
 * @param {LivingEntity} victim 
 * @param {Entity} attacker 
 */
// @ts-ignore
EntropyHelper.isFromQuantumAttacker = function(victim, attacker) {
	if (!(attacker instanceof $ServerPlayer)) {
		return false;
	}

	return SkillHelper.hasSkill(attacker, FarlanderSkills.QUANTUM_RENDING);
}

/**
 * 
 * @param {LivingEntity} entity 
 */
EntropyHelper.getInterval = function(entity) {
	const player = entity instanceof $ServerPlayer ? entity : null;

	if (player == null) {
		return 1;
	}
	else if (SkillHelper.hasSkill(player, FarlanderSkills.QUANTUM_DELAY_1)) {
		return 2;
	}
	else {
		return 1;
	}
}

/**
 * 
 * @param {LivingEntity} victim 
 * @param {Entity} attacker 
 */
EntropyHelper.getEntropyPercentageFromAttacker = function(victim, attacker) {
	if (!(attacker instanceof $ServerPlayer)) {
		return 0.0;
	}
	else if (SkillHelper.hasSkill(attacker, FarlanderSkills.QUANTUM_RENDING)) {
		return 0.33;
	}
	else {
		return 0.0;
	}
}