class EntropyHelper {
	public static isFromQuantumAttacker(victim: LivingEntity_, attacker: Entity_) {
		if (!(attacker instanceof $ServerPlayer)) {
			return false;
		}

		return SkillHelper.hasSkill(attacker, FarlanderSkills.QUANTUM_RENDING);
	}

	public static isFarlander(entity: ServerPlayer_): boolean {
		return SkillHelper.hasSkill(entity, FarlanderSkills.QUANTUM_UNCERTAINTY);
	}

	public static getInterval(entity: LivingEntity_) {
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

	public static getDecayPercentage(entity: LivingEntity_) {
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

	public static getLifetimeEntropyDamage(entity: LivingEntity_) {
		return entity.persistentData.getDouble("lifetime_entropy_damage");
	}

	public static incrementLifetimeEntropyDamage(entity: LivingEntity_, amount: double) {
		entity.persistentData.putDouble("lifetime_entropy_damage", this.getLifetimeEntropyDamage(entity) + amount);
	}

	public static resetLifetimeEntropyDamage(entity: LivingEntity_) {
		entity.persistentData.remove("lifetime_entropy_damage");
	}

	public static getEntropyPercentageFromAttacker(victim: LivingEntity_, attacker: Entity_) {
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
}