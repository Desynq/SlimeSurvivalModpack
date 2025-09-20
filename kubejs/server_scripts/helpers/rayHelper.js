
let $ClipContext$Fluid = Java.loadClass("net.minecraft.world.level.ClipContext$Fluid");
let $ClipContext$Block = Java.loadClass("net.minecraft.world.level.ClipContext$Block");
let $ClipContext = Java.loadClass("net.minecraft.world.level.ClipContext");

/**
 * @param {$ServerPlayer_} player
 * @param {number} maxDistance
 * @returns {$BlockPos_|null}
 */
function getBlockPlayerIsLookingAt(player, maxDistance) {
	const eyePos = player.getEyePosition(1.0);
	const lookVec = player.getLookAngle();
	const reachVec = eyePos.add(lookVec.x * maxDistance, lookVec.y * maxDistance, lookVec.z * maxDistance);

	const context = new $ClipContext(
		eyePos, reachVec,
		$ClipContext$Block.OUTLINE,
		$ClipContext$Fluid.NONE,
		player
	);

	const result = player.level.clip(context);

	if (result.getType() == $HitResult$Type.BLOCK) {
		return result.getBlockPos();
	}

	return null;
}