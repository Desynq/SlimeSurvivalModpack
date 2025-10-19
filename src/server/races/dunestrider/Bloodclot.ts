// priority: 1

namespace BloodclotSkill {
	const BLOODCLOT_MAX_ABSORPTION = new AttributeModifierController("generic.max_absorption", "bloodclot", 20, "add_value");
	const BLOODCLOT_DECAY_COOLDOWN = new EntityTimestamp("bloodclot_decay_cooldown");

	/**
	 * @param healAmount Number >= 0
	 * @returns Left over heal amount after trying to apply bloodclot
	 */
	export function applyOverheal(player: ServerPlayer_, healAmount: number): number {
		const bloodclotTier = SkillHelper.getSkillTier(player,
			DunestriderSkills.BLOODCLOT_1
		);
		if (bloodclotTier === 0) return healAmount;

		// ensures that we track the highest bloodclot amount and caps it to their max possible bloodclot amount
		const maxAbsorption = Math.min(getMaxBloodclot(player), getCurrentBloodclot(player) + healAmount);
		BLOODCLOT_MAX_ABSORPTION.withValue(maxAbsorption).add(player);
		BLOODCLOT_DECAY_COOLDOWN.update(player);

		const currentAbsorption = player.absorptionAmount;
		const healLimit = maxAbsorption - currentAbsorption;
		const absorptionToAdd = Math.min(healAmount, healLimit);

		player.setAbsorptionAmount(player.absorptionAmount + absorptionToAdd);

		return healAmount - absorptionToAdd;
	}

	export function decayOverheal(player: ServerPlayer_): void {
		if (!BLOODCLOT_MAX_ABSORPTION.has(player)) return;

		const duration = getBloodclotDecayDuration(player);
		if (!BLOODCLOT_DECAY_COOLDOWN.tryUpdate(player, duration)) return;

		let current = BLOODCLOT_MAX_ABSORPTION.get(player);
		if (current <= 0) {
			BLOODCLOT_MAX_ABSORPTION.remove(player);
			return;
		}

		const newValue = Math.max(0, current - 1.0);
		BLOODCLOT_MAX_ABSORPTION.withValue(newValue).add(player);
	}

	function getBloodclotDecayDuration(player: ServerPlayer_): number {
		return 20;
	}

	function getCurrentBloodclot(player: ServerPlayer_): number {
		return BLOODCLOT_MAX_ABSORPTION.get(player);
	}

	function getMaxBloodclot(player: ServerPlayer_): number {
		return player.maxHealth;
	}
}