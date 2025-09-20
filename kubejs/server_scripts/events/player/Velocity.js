
const Velocity = {};

/** @type {Object.<string, double>} */
Velocity.velocities = {};

/** @type {Object.<string, import("net.minecraft.world.phys.Vec3").$Vec3$$Original} */
Velocity.lastPositions = {};

/**
 * 
 * @param {ServerPlayer} player
 */
Velocity.get = function(player) {
	const v = Velocity.velocities[player.stringUUID];
	return v == undefined ? 0 : v;
}

/**
 * 
 * @param {ServerPlayer} player
 */
Velocity.set = function(player) {
	let lastPos = Velocity.lastPositions[player.stringUUID];
	const currPos = player.position();
	if (lastPos == undefined) lastPos = currPos;
	Velocity.lastPositions[player.stringUUID] = currPos;

	// @ts-ignore
	const v = currPos.distanceTo(lastPos);
	Velocity.velocities[player.stringUUID] = v;
	return v;
}

PlayerEvents.tick(event => {
	if (event.player instanceof $ServerPlayer) {
		Velocity.set(event.player);
	}
});