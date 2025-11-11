// priority: 1000

namespace KeybindHelper {

	const movementKeys: readonly string[] = ["key.forward", "key.left", "key.right", "key.back", "key.jump"];

	export function isMoving(player: ServerPlayer_): boolean {
		for (const key of movementKeys) {
			if (key === "key.jump" && LivingEntityHelper.hasEffect(player, "slimesurvival:rooted")) continue;

			if (KeybindManager.INSTANCE.isKeyDown(player, key)) return true;
		}

		return false;
	}
}