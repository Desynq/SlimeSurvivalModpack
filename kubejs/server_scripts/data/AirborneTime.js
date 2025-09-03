PlayerEvents.tick(event => {
	const { player } = event;

	if (!player.onGround() && !player.abilities.flying) {
		AirborneTime.increment(player);
	}
	else if (AirborneTime.get(player) > 0) {
		AirborneTime.set(player, 0);
	}
})



const AirborneTime = {};

/**
 * @param {$ServerPlayer_} player
 */
AirborneTime.get = function (player) {
	return player.persistentData.getInt("airborne_time");
}

/**
 * @param {$ServerPlayer_} player
 * @param {integer} time
 */
AirborneTime.set = function (player, time) {
	player.persistentData.putInt("airborne_time", time);
}

/**
 * @param {$ServerPlayer_} player 
 */
AirborneTime.increment = function (player) {
	AirborneTime.set(player, AirborneTime.get(player) + 1);
}