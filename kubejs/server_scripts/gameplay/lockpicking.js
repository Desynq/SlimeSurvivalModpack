
PlayerEvents.tick(event => Lockpicking.tick(event.player));

const Lockpicking = {}

/**
 * 
 * @param {$ServerPlayer_} player 
 * @returns {integer[]|null}
 */
Lockpicking.getPlayerData = function (player) {
	// blockX, blockY, blockZ, time
	return player.persistentData.getIntArray("lockpicking_time");
}


/**
 * 
 * @param {$ServerPlayer_} player 
 * @param {integer} blockX 
 * @param {integer} blockY 
 * @param {integer} blockZ 
 * @param {integer} time 
 */
Lockpicking.setPlayerData = function (player, blockX, blockY, blockZ, time) {
	player.persistentData.putIntArray("lockpicking_time", [blockX, blockY, blockZ, time]);
}

/**
 * 
 * @param {$ServerPlayer_} player 
 */
Lockpicking.resetPlayerData = function (player) {
	player.persistentData.remove("lockpicking_time");
}


/**
 * 
 * @param {$ServerPlayer_} player 
 * @param {integer} time 
 */
Lockpicking.addPlayerTime = function (player, time) {
	const data = Lockpicking.getPlayerData(player);
	data[3] += time;
	Lockpicking.setPlayerTime(player, data[0], data[1], data[2], data[3]);
}


/**
 * 
 * @param {$ServerPlayer_} player 
 */
Lockpicking.tick = function (player) {
	const data = Lockpicking.getPlayerData(player);

	const attr = player.getAttribute($Attributes.BLOCK_INTERACTION_RANGE);
	const blockInteractionRange = attr != null ? attr.getValue() : 0;

	const currentBlock = getBlockPlayerIsLookingAt(player, blockInteractionRange);
	if (currentBlock == null) {
		if (data != null) Lockpicking.resetPlayerData(player);
		return;
	}

	const baseLockpickingTime = Lockpicking.getTime(BlockPosHelper.toIntArray(currentBlock));
}



/**
 * 
 * @param {integer[]} blockPos 
 */
Lockpicking.getTime = function (blockPos) {
}


/**
 * 
 * @param {$ServerPlayer_} player 
 * @returns {boolean}
 */
Lockpicking.isSameLockpickingBlock = function (player) {
	const data = getPlayerLockpickingTime(player);
	const currentBlockPos = player.getBlock().getPos();
	if (data[0] == currentBlockPos.x && data[1] == currentBlockPos.y && data[2] == currentBlockPos.z) {

	}
}