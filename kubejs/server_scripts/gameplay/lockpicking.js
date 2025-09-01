
PlayerEvents.tick(event => tickLockpick(event.player));

/**
 * 
 * @param {$ServerPlayer_} player 
 * @returns {integer[]|null}
 */
function getPlayerLockpickingTime(player) {
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
function setPlayerLockpickingTime(player, blockX, blockY, blockZ, time) {
	player.persistentData.putIntArray("lockpicking_time", [blockX, blockY, blockZ, time]);
}

/**
 * 
 * @param {$ServerPlayer_} player 
 */
function resetPlayerLockpickingTime(player) {
	player.persistentData.remove("lockpicking_time");
}


/**
 * 
 * @param {$ServerPlayer_} player 
 * @param {integer} time 
 */
function addPlayerLockpickingTime(player, time) {
	const data = getPlayerLockpickingTime(player);
	data[3] += time;
	setPlayerLockpickingTime(player, data[0], data[1], data[2], data[3]);
}


/**
 * 
 * @param {$ServerPlayer_} player 
 */
function tickLockpick(player) {
	const data = getPlayerLockpickingTime(player);

	const attr = player.getAttribute($Attributes.BLOCK_INTERACTION_RANGE);
	const blockInteractionRange = attr != null ? attr.getValue() : 0;

	const currentBlock = getBlockPlayerIsLookingAt(player, blockInteractionRange);
	if (currentBlock == null) {
		if (data != null) resetPlayerLockpickingTime(player);
		return;
	}
}


/**
 * 
 * @param {$ServerPlayer_} player 
 * @returns {boolean}
 */
function isSameLockpickingBlock(player) {
	const data = getPlayerLockpickingTime(player);
	const currentBlockPos = player.getBlock().getPos();
	if (data[0] == currentBlockPos.x && data[1] == currentBlockPos.y && data[2] == currentBlockPos.z) {

	}
}