


namespace DemeanSkill {
	/**
	 * Made Demean modify the dunestrider's attack damage rather than override it so that's it more balanced in boss fights.
	 */
	export function getDamageModifier(attacker: ServerPlayer_, victim: LivingEntity_): float {
		const demeanTier = SkillHelper.getSkillTier(attacker,
			DunestriderSkills.DEMEAN_1,
			DunestriderSkills.DEMEAN_2,
			DunestriderSkills.DEMEAN_3
		);

		return calculateDamageModifier(demeanTier, victim.health, attacker.maxHealth);
	}

	export function calculateDamageModifier(demeanTier: integer, victimHealth: float, attackerMaxHealth: double): float {
		let factor: number;
		switch (demeanTier) {
			case 1:
				factor = 0.25;
				break;
			case 2:
				factor = 0.5;
				break;
			case 3:
				factor = 1.0;
				break;
			default:
				return 1.0; // no modifier
		}

		const ratio = Math.max(1, victimHealth / attackerMaxHealth);
		const modifier = Math.log10(ratio) * factor;
		return 1 + modifier;
	}
}