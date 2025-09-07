PlayerEvents.tick(event => {
	const player = event.getPlayer();
	const closestPlayer = getPlayersSortedByDistance(player)[0];

	if (closestPlayer != null) {
		setPlayerCompass(player, closestPlayer);
	}
});



/**
 * 
 * @param {$ServerPlayer_} player
 * @returns {$ServerPlayer_[]}
 */
function getPlayersSortedByDistance(player) {
	return player.level.players.stream()
		.filter(p => p != player && !p.spectator && !p.creative)
		.sorted($Comparator.comparingDouble(p => p.distanceToSqr(player.position)))
		.toArray();
}


/**
 * 
 * @param {$ServerPlayer_} player 
 * @param {$ServerPlayer_} closestPlayer 
 */
function setPlayerCompass(player, closestPlayer) {
	if (player.permissionLevel < 2) {
		return;
	}

	const stack = player.inventory.getStackInSlot(8);
	const item = stack.item;
	if (item.id != "minecraft:compass") {
		return;
	}

	const posIntArrayString = `[I;${closestPlayer.blockX},${closestPlayer.blockY},${closestPlayer.blockZ}]`
	const dimensionString = `"${closestPlayer.level.dimension.toString()}"`
	const command = `item replace entity ${player.username} hotbar.8 with minecraft:compass[minecraft:lodestone_tracker={target:{pos:${posIntArrayString},dimension:${dimensionString}}}]`;
	// tellIfOperator(player, command);
	player.server.runCommandSilent(command);
}