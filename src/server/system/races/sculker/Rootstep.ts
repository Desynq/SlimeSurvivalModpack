


namespace Sculker.Rootstep {

	const stepModifier = new AttributeModifierController("minecraft:generic.step_height", "sculker.rootstep", 0.5, "add_value");

	export function onGround(player: ServerPlayer_): boolean {
		if (player.onGround()) return true;

		if (SculkerSkills.ROOTFALL.isUnlockedFor(player)) {
			return Sculker.Rootfall.isActive(player);
		}

		return false;
	}


	export function tickRootstep(player: ServerPlayer_): void {
		if (SculkerSkills.ROOTSTEP.isLockedFor(player) || !player.crouching || !player.shiftKeyDown || !isCollidingHorizontally(player)) {
			stepModifier.remove(player);
			return;
		}

		stepModifier.add(player);
	}

	function isCollidingHorizontally(player: ServerPlayer_): boolean {
		const level = player.level;

		const box = player.getBoundingBox().deflate(0, 0.1, 0);

		const eps = 0.001;

		for (const pos of [
			[eps, 0, 0],
			[-eps, 0, 0],
			[0, 0, eps],
			[0, 0, -eps]
		]) {
			if (!level.noCollision(player, box.expandTowards(pos[0], pos[1], pos[2]))) return true;
		}

		return false;
	}
}