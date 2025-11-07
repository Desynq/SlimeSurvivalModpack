

namespace Chimera.ToxophiliteSkill {

	export function applyBoost(owner: ServerPlayer_, arrow: AbstractArrow_): void {
		const strengthPoints = AttributePointHelper.getStrengthPoints(owner);
		if (strengthPoints <= 0) return;

		const modifier = strengthPoints * 0.05;
		arrow.baseDamage *= 1 + modifier;
	}

	export function applySlowdown(player: ServerPlayer_): void {
		player.setSprinting(false);
	}
}