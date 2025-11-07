


namespace Chimera.Timid {

	export function tryDecreaseBowDamage(player: ServerPlayer_, victim: LivingEntity_, event: LivingDamageEvent$Pre_): void {
		if (ChimeraSkills.TIMID.isLockedFor(player)) return;

		const distance = player.distanceToEntity(victim);

		const mult = getMultiplier(distance);
		event.newDamage *= mult;
	}

	const Constants = Chimera.Constants.Timid;

	// exported for unit testing
	export function getMultiplier(distance: double, epsilon: double = 4): double {
		if (Constants.MAX_DIST <= Constants.MIN_DIST) return 1;
		const x = MathHelper.clamped((distance - Constants.MIN_DIST) / (Constants.MAX_DIST - Constants.MIN_DIST), 0, 1);
		const r = MathHelper.expRamp01(x, epsilon);
		return MathHelper.lerp(Constants.MIN_DIST_MULT, Constants.MAX_DIST_MULT, r);
	};
}