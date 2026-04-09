


namespace Sculker.Nourishment {

	const recoveryTimer = new EntityTimestamp("last_famished");
	const graceTimer = new EntityTimestamp("sculker.nourishment.grace", 4);

	const nourishmentEffect = MobEffectApplicator.of("farmersdelight:nourishment")
		.withDuration(19)
		.withVisibility(false, true);

	/**
	 * Assumes player has Nourishment already unlocked
	 */
	function getRecoveryDuration(player: ServerPlayer_): number {
		let ticks = SculkerSkills.NOURISHMENT.data.recovery;

		SculkerSkills.ROOTFALL.ifUnlocked(player, s => {
			ticks += s.data.nourishmentRecoveryTicks;
		});
		return ticks;
	}

	export function tick(player: ServerPlayer_): void {
		if (SculkerSkills.NOURISHMENT.isLockedFor(player)) return;

		const recovery = recoveryTimer.resolve(player);
		const nourishWindow = graceTimer.resolve(player);
		const state = getNourishState(player);

		switch (state) {
			case "inactive":
			case "hungry":
				if (nourishWindow.elapsed) {
					recovery.update();
				}
				break;
			case "rootfalling":
				nourishWindow.elapse();
				break;
			case "on_sculkable":
				nourishWindow.update();
				break;
			default: exhaustiveSwitch(state);
		}

		// Either not nourishable or still recovering
		if (!recovery.hasElapsed(getRecoveryDuration(player))) {
			nourishmentEffect.remove(player);
			return;
		}

		nourishmentEffect.apply(player);
	}

	type NourishState = "hungry" | "rootfalling" | "on_sculkable" | "inactive";

	function getNourishState(player: ServerPlayer_): NourishState {
		if (LivingEntityHelper.hasEffect(player, "minecraft:hunger")) {
			return "hungry";
		}

		if (nourishmentEffect.hasExact(player) && Sculker.Rootfall.isActive(player)) {
			return "rootfalling";
		}

		if (player.level.getBlockState(player.blockPosBelowThatAffectsMyMovement)["is(net.minecraft.tags.TagKey)"]("minecraft:sculk_replaceable")) {
			return "on_sculkable";
		}

		return "inactive";
	}
}