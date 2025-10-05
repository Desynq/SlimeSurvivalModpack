


namespace DemeanSkill {
	/**
	 * Made Demean modify the dunestrider's attack damage rather than override it so that's it more balanced in boss fights.
	 */
	export function getDamageModifier(attacker: ServerPlayer_, victim: LivingEntity_): float {
		const tier = SkillHelper.getSkillTier(attacker,
			DunestriderSkills.DEMEAN_1,
			DunestriderSkills.DEMEAN_2,
			DunestriderSkills.DEMEAN_3
		);

		let factor: float;
		switch (tier) {
			case 1:
				factor = 0.025;
				break;
			case 2:
				factor = 0.05;
				break;
			case 3:
				factor = 0.1;
				break;
			default:
				return 1.0;
		}
		const modifier = Math.max(1, victim.health / attacker.maxHealth * factor);
		return modifier;
	}
}