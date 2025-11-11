


namespace Chimera.DropshotSkill {

	export function onShoot(chimera: ServerPlayer_, arrow: AbstractArrow_): void {
		if (ChimeraSkills.DROPSHOT.isLockedFor(chimera)) return;

		if (chimera.fallDistance <= 0) return;

		arrow.baseDamage *= 2.0;
	}
}