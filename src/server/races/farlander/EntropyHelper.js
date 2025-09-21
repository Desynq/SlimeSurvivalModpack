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
 * @param {ServerPlayer} entity 
 * @returns {boolean}
 */
EntropyHelper.isFarlander = function(entity) {
	return SkillHelper.hasSkill(entity, FarlanderSkills.QUANTUM_UNCERTAINTY);
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

	const tier = SkillHelper.getSkillTier(player,
		FarlanderSkills.QUANTUM_DELAY_1,
		FarlanderSkills.QUANTUM_DELAY_2,
	);

	switch (tier) {
		case 1:
			return 2;
		case 2:
			return 4;
		default:
			return 1;
	}
}

/**
 * @param {LivingEntity} entity 
 */
EntropyHelper.getDecayPercentage = function(entity) {
	const player = entity instanceof $ServerPlayer ? entity : null;
	let percentage = 0.1;
	if (player == null) {
		return percentage;
	}

	if (SkillHelper.hasSkill(player, FarlanderSkills.QUANTUM_DELAY_2)) {
		percentage *= 1.5;
	}
	return percentage;
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
	else if (SkillHelper.hasSkill(attacker, FarlanderSkills.QUANTUM_RENDING_2)) {
		return 2 / 3;
	}
	else if (SkillHelper.hasSkill(attacker, FarlanderSkills.QUANTUM_RENDING)) {
		return 1 / 3;
	}
	else {
		return 0.0;
	}
}